import * as vscode from 'vscode';

type Phase = 'idle' | 'focus' | 'break';

export function activate(context: vscode.ExtensionContext) {
	const provider = new CozyWindowProvider(context.extensionUri, context.globalState);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(CozyWindowProvider.viewId, provider),

		vscode.commands.registerCommand('cozyWindow.focus', () => provider.timerAction()),
		vscode.commands.registerCommand('cozyWindow.showTimer', () => provider.setTimerVisible(true)),
		vscode.commands.registerCommand('cozyWindow.hideTimer', () => provider.setTimerVisible(false)),
		vscode.commands.registerCommand('cozyWindow.changeCompanion', () =>
			pickSetting('companion', 'Who should sit by your window?', [
				{ value: 'cat', label: '$(heart) Mochi', detail: 'A sleepy orange tabby cat' },
				{ value: 'dog', label: '$(heart) Biscuit', detail: 'A floppy-eared puppy' },
			])
		),
		vscode.commands.registerCommand('cozyWindow.changeScene', () =>
			pickSetting('scene', 'Pick a scene for your window', [
				{ value: 'auto', label: 'Automatic', detail: 'Follows the calendar: seasons and holidays' },
				{ value: 'winter', label: 'Winter' },
				{ value: 'halloween', label: 'Halloween' },
				{ value: 'christmas', label: 'Christmas' },
				{ value: 'easter', label: 'Easter' },
			])
		),
		vscode.commands.registerCommand('cozyWindow.openSettings', () =>
			vscode.commands.executeCommand('workbench.action.openSettings', 'cozyWindow')
		),

		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('cozyWindow')) {
				provider.sendConfig();
			}
		}),
		provider
	);
}

export function deactivate() {}

class CozyWindowProvider implements vscode.WebviewViewProvider, vscode.Disposable {
	static readonly viewId = 'cozyWindow.view';

	private view?: vscode.WebviewView;
	private timerVisible: boolean;
	private phase: Phase = 'idle';
	private endsAt = 0;
	private total = 0;
	private paused = false;
	private remaining = 0;
	private ticker?: NodeJS.Timeout;
	private readonly statusBar: vscode.StatusBarItem;

	constructor(private readonly extensionUri: vscode.Uri, private readonly state: vscode.Memento) {
		this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		this.statusBar.command = 'cozyWindow.focus';

		// Cozy by default: the timer only shows up for people who turn it on.
		this.timerVisible = state.get<boolean>('timerVisible', false);
		vscode.commands.executeCommand('setContext', 'cozyWindow.timerVisible', this.timerVisible);
		this.updateStatusBar();
	}

	setTimerVisible(visible: boolean) {
		this.timerVisible = visible;
		this.state.update('timerVisible', visible);
		vscode.commands.executeCommand('setContext', 'cozyWindow.timerVisible', visible);
		if (!visible) {
			this.stopTimer();
		} else {
			this.updateStatusBar();
			this.sendTimer();
		}
	}

	dispose() {
		this.stopTicking();
		this.statusBar.dispose();
	}

	resolveWebviewView(webviewView: vscode.WebviewView): void {
		this.view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')],
		};
		webviewView.webview.html = this.getHtml(webviewView.webview);

		webviewView.webview.onDidReceiveMessage((msg) => {
			if (msg?.type === 'ready') {
				this.sendConfig();
				this.sendTimer();
			} else if (msg?.type === 'start') {
				this.startPhase('focus', this.minutes('focusMinutes', 25));
			} else if (msg?.type === 'pause') {
				this.pause();
			} else if (msg?.type === 'resume') {
				this.resume();
			} else if (msg?.type === 'stop') {
				this.stopTimer();
			}
		});
		webviewView.onDidDispose(() => {
			this.view = undefined;
		});
	}

	sendConfig() {
		const config = vscode.workspace.getConfiguration('cozyWindow');
		this.post({
			type: 'config',
			companion: config.get<string>('companion', 'cat'),
			scene: config.get<string>('scene', 'auto'),
			hemisphere: config.get<string>('hemisphere', 'north'),
			holidays: config.get<boolean>('holidays', true),
			sound: config.get<boolean>('sound', true),
			previewDate: config.get<string>('preview.date', ''),
		});
	}

	// ---------- Treats ----------
	feed() {
		vscode.commands.executeCommand(`${CozyWindowProvider.viewId}.focus`).then(() => this.post({ type: 'feed' }));
	}

	// ---------- Focus timer ----------
	// The clock button and the status bar start a session,
	// or pause and resume the one that is running.
	timerAction() {
		if (!this.timerVisible) {
			this.setTimerVisible(true);
		}
		if (this.phase === 'idle') {
			this.startPhase('focus', this.minutes('focusMinutes', 25));
		} else if (this.paused) {
			this.resume();
		} else {
			this.pause();
		}
	}

	private pause() {
		if (this.phase === 'idle' || this.paused) {
			return;
		}
		this.remaining = Math.max(0, this.endsAt - Date.now());
		this.paused = true;
		this.stopTicking();
		this.updateStatusBar();
		this.sendTimer();
	}

	private resume() {
		if (!this.paused) {
			return;
		}
		this.paused = false;
		this.endsAt = Date.now() + this.remaining;
		this.ticker = setInterval(() => this.onTick(), 1000);
		this.updateStatusBar();
		this.sendTimer();
	}

	private stopTimer() {
		this.phase = 'idle';
		this.paused = false;
		this.stopTicking();
		this.updateStatusBar();
		this.sendTimer();
	}

	private startPhase(phase: Phase, minutes: number) {
		this.phase = phase;
		this.paused = false;
		this.total = minutes * 60 * 1000;
		this.endsAt = Date.now() + this.total;
		this.stopTicking();
		this.ticker = setInterval(() => this.onTick(), 1000);
		this.updateStatusBar();
		this.sendTimer();
	}

	private onTick() {
		if (Date.now() < this.endsAt) {
			this.updateStatusBar();
			return;
		}
		const name = this.petName();
		if (this.phase === 'focus') {
			this.post({ type: 'sound' });
			this.startPhase('break', this.minutes('breakMinutes', 5));
			vscode.window.showInformationMessage(`Focus session done! ${name} wants a little stretch.`, 'Give a treat', 'Skip break')
				.then((choice) => {
					if (choice === 'Give a treat') { this.feed(); }
					if (choice === 'Skip break') { this.stopTimer(); }
				});
		} else {
			this.stopTimer();
			vscode.window.showInformationMessage(`Break is over. ${name} is ready to nap while you focus.`, 'Start focus')
				.then((choice) => { if (choice) { this.timerAction(); } });
		}
	}

	private stopTicking() {
		if (this.ticker) {
			clearInterval(this.ticker);
			this.ticker = undefined;
		}
	}

	private updateStatusBar() {
		if (!this.timerVisible) {
			this.statusBar.hide();
			return;
		}
		if (this.phase === 'idle') {
			this.statusBar.text = '$(watch) Start focus';
			this.statusBar.tooltip = 'Cozy Window: start a focus session';
			this.statusBar.show();
			return;
		}
		const left = this.paused ? this.remaining : Math.max(0, this.endsAt - Date.now());
		const clock = `${Math.floor(left / 60000)}:${String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}`;
		if (this.paused) {
			this.statusBar.text = `$(debug-pause) ${clock} paused`;
			this.statusBar.tooltip = 'Cozy Window: paused. Click to resume.';
		} else if (this.phase === 'focus') {
			this.statusBar.text = `$(watch) ${clock}`;
			this.statusBar.tooltip = 'Cozy Window: focusing. Click to pause.';
		} else {
			this.statusBar.text = `$(coffee) ${clock} break`;
			this.statusBar.tooltip = 'Cozy Window: break time. Click to pause.';
		}
		this.statusBar.show();
	}

	private sendTimer() {
		this.post({ type: 'timer', visible: this.timerVisible, phase: this.phase, paused: this.paused, remaining: this.remaining, endsAt: this.endsAt, total: this.total });
	}

	private minutes(key: string, fallback: number) {
		const value = vscode.workspace.getConfiguration('cozyWindow').get<number>(key, fallback);
		return value > 0 ? value : fallback;
	}

	private petName() {
		return vscode.workspace.getConfiguration('cozyWindow').get<string>('companion', 'cat') === 'dog' ? 'Biscuit' : 'Mochi';
	}

	private post(message: unknown) {
		this.view?.webview.postMessage(message);
	}

	private getHtml(webview: vscode.Webview): string {
		const nonce = getNonce();
		const mediaUri = (file: string) =>
			webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', file));

		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Security-Policy"
		content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource}; media-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="${mediaUri('main.css')}">
	<title>Cozy Window</title>
</head>
<body>
	<div id="scene"></div>
	<div class="message" id="message"></div>
	<div id="focus-ui" hidden>
		<div class="timer-row">
			<span id="timer-label"></span>
			<span id="timer-time"></span>
		</div>
		<div class="timer-bar"><div id="timer-fill"></div></div>
	</div>
	<div class="actions">
		<button id="timer-btn" type="button"></button>
		<button id="end-btn" type="button" class="secondary" hidden></button>
		<button id="feed-btn" type="button" class="secondary"></button>
	</div>
	<audio id="snd-cat" src="${mediaUri('sounds/meow.mp3')}" preload="auto"></audio>
	<audio id="snd-dog" src="${mediaUri('sounds/woof.mp3')}" preload="auto"></audio>
	<script nonce="${nonce}" src="${mediaUri('main.js')}"></script>
</body>
</html>`;
	}
}

// Shows a quick pick from the panel's toolbar and saves the choice as a setting.
async function pickSetting(key: string, placeHolder: string, options: { value: string; label: string; detail?: string }[]) {
	const config = vscode.workspace.getConfiguration('cozyWindow');
	const current = config.get<string>(key);
	const picked = await vscode.window.showQuickPick(
		options.map((o) => ({ ...o, description: o.value === current ? 'current' : undefined })),
		{ placeHolder }
	);
	if (picked) {
		await config.update(key, picked.value, vscode.ConfigurationTarget.Global);
	}
}

function getNonce(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let text = '';
	for (let i = 0; i < 32; i++) {
		text += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return text;
}