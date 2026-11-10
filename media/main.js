// Cozy Window – scene script (runs inside the webview)
(function () {
	const vscode = acquireVsCodeApi();

	// ---------- Companions ----------
	const PETS = {
		cat: { name: 'Mochi', sleep: `<path d="M146 62 Q160 86 120 86 Q90 87 74 82" stroke="#f0a862" stroke-width="14" fill="none" stroke-linecap="round"></path><path d="M140 80 L136 74 M124 85 L122 78" stroke="#d4843f" stroke-width="4.5" stroke-linecap="round"></path><ellipse cx="104" cy="64" rx="44" ry="22" fill="#f0a862"></ellipse><path d="M96 44 Q100 52 96 60 M114 44 Q118 52 114 61" stroke="#d4843f" stroke-width="5.5" fill="none" stroke-linecap="round"></path><g class="ear"><path d="M24 34 Q22 10 30 8 Q38 14 44 26 Z" fill="#f0a862"></path><path d="M28 28 Q28 16 31 14 Q35 18 38 25 Z" fill="#f6b9c0"></path></g><path d="M62 24 Q70 12 78 12 Q82 20 80 36 Z" fill="#f0a862"></path><path d="M66 25 Q71 18 76 17 Q78 23 77 31 Z" fill="#f6b9c0"></path><ellipse cx="52" cy="52" rx="32" ry="29" fill="#f0a862"></ellipse><path d="M46 26 L47 33 M54 25 L54 32 M62 27 L60 33" stroke="#d4843f" stroke-width="3.6" stroke-linecap="round"></path><ellipse cx="52" cy="66" rx="18" ry="12" fill="#fff6ea"></ellipse><path d="M33 53 Q39 59 45 53 M59 53 Q65 59 71 53" stroke="#3a2418" stroke-width="2.6" fill="none" stroke-linecap="round"></path><ellipse cx="30" cy="63" rx="6" ry="3.6" fill="#f59aa6" opacity=".55"></ellipse><ellipse cx="74" cy="63" rx="6" ry="3.6" fill="#f59aa6" opacity=".55"></ellipse><path d="M49 61 L55 61 L52 64.5 Z" fill="#ee8f9c"></path><path d="M52 65 Q49 69 46 67 M52 65 Q55 69 58 67" stroke="#3a2418" stroke-width="1.5" fill="none" stroke-linecap="round"></path><ellipse cx="38" cy="82" rx="11" ry="6" fill="#fff6ea"></ellipse><ellipse cx="62" cy="83" rx="11" ry="6" fill="#fff6ea"></ellipse>`, awake: `<path class="wag" d="M84 136 Q112 128 104 100" stroke="#f0a862" stroke-width="12" fill="none" stroke-linecap="round"></path><ellipse cx="60" cy="120" rx="30" ry="26" fill="#f0a862"></ellipse><ellipse cx="60" cy="124" rx="16" ry="18" fill="#fff6ea"></ellipse><ellipse cx="48" cy="144" rx="10" ry="6" fill="#fff6ea"></ellipse><ellipse cx="72" cy="144" rx="10" ry="6" fill="#fff6ea"></ellipse><path d="M26 44 Q22 10 32 6 Q44 14 52 30 Z" fill="#f0a862"></path><path d="M31 38 Q29 18 34 14 Q41 20 46 30 Z" fill="#f6b9c0"></path><path d="M94 44 Q98 10 88 6 Q76 14 68 30 Z" fill="#f0a862"></path><path d="M89 38 Q91 18 86 14 Q79 20 74 30 Z" fill="#f6b9c0"></path><ellipse cx="60" cy="62" rx="38" ry="34" fill="#f0a862"></ellipse><path d="M52 30 L53 38 M60 29 L60 37 M68 30 L67 38" stroke="#d4843f" stroke-width="4" stroke-linecap="round"></path><ellipse cx="60" cy="78" rx="17" ry="11" fill="#fff6ea"></ellipse><ellipse cx="44" cy="62" rx="8" ry="9.5" fill="#3a2418"></ellipse><ellipse cx="76" cy="62" rx="8" ry="9.5" fill="#3a2418"></ellipse><circle cx="41.5" cy="58.5" r="3.2" fill="#ffffff"></circle><circle cx="73.5" cy="58.5" r="3.2" fill="#ffffff"></circle><circle cx="47" cy="66" r="1.5" fill="#ffffff"></circle><circle cx="79" cy="66" r="1.5" fill="#ffffff"></circle><ellipse cx="32" cy="76" rx="7" ry="4" fill="#f59aa6" opacity=".6"></ellipse><ellipse cx="88" cy="76" rx="7" ry="4" fill="#f59aa6" opacity=".6"></ellipse><path d="M57 73 L63 73 L60 76.5 Z" fill="#ee8f9c"></path><path d="M60 77 Q57 81 54 79 M60 77 Q63 81 66 79" stroke="#3a2418" stroke-width="1.6" fill="none" stroke-linecap="round"></path><path d="M40 78 L26 76 M40 81 L27 84 M80 78 L94 76 M80 81 L93 84" stroke="#fff6ea" stroke-width="1.3" opacity=".85"></path>` },
		dog: { name: 'Biscuit', sleep: `<path class="wag" d="M144 56 Q158 50 154 38" stroke="#f5dfbd" stroke-width="9" fill="none" stroke-linecap="round"></path><ellipse cx="104" cy="64" rx="44" ry="21" fill="#f5dfbd"></ellipse><ellipse cx="114" cy="52" rx="22" ry="10" fill="#e3b37f"></ellipse><ellipse cx="52" cy="54" rx="34" ry="29" fill="#f5dfbd"></ellipse><g class="ear"><ellipse cx="24" cy="54" rx="11" ry="21" fill="#d29a62" transform="rotate(14 24 54)"></ellipse></g><ellipse cx="80" cy="54" rx="11" ry="21" fill="#d29a62" transform="rotate(-14 80 54)"></ellipse><ellipse cx="52" cy="68" rx="17" ry="11" fill="#fff3e2"></ellipse><path d="M36 52 Q42 58 48 52 M56 52 Q62 58 68 52" stroke="#3a2418" stroke-width="2.6" fill="none" stroke-linecap="round"></path><ellipse cx="33" cy="64" rx="6" ry="3.6" fill="#f59aa6" opacity=".55"></ellipse><ellipse cx="71" cy="64" rx="6" ry="3.6" fill="#f59aa6" opacity=".55"></ellipse><ellipse cx="52" cy="63" rx="6" ry="4.4" fill="#3a2418"></ellipse><path d="M52 67 V70 M52 70 Q48 73 45 70 M52 70 Q56 73 59 70" stroke="#3a2418" stroke-width="1.5" fill="none" stroke-linecap="round"></path><ellipse cx="38" cy="83" rx="11" ry="6" fill="#fff3e2"></ellipse><ellipse cx="64" cy="84" rx="11" ry="6" fill="#fff3e2"></ellipse>`, awake: `<path class="wag" d="M84 126 Q102 120 106 102" stroke="#f5dfbd" stroke-width="10" fill="none" stroke-linecap="round"></path><ellipse cx="60" cy="120" rx="28" ry="26" fill="#f5dfbd"></ellipse><ellipse cx="60" cy="122" rx="15" ry="18" fill="#fff3e2"></ellipse><ellipse cx="47" cy="144" rx="10" ry="7" fill="#fff3e2"></ellipse><ellipse cx="73" cy="144" rx="10" ry="7" fill="#fff3e2"></ellipse><rect x="40" y="94" width="40" height="7" rx="3.5" fill="#a8d8c8"></rect><circle cx="60" cy="104" r="4.2" fill="#f5c451"></circle><ellipse cx="60" cy="60" rx="38" ry="34" fill="#f5dfbd"></ellipse><ellipse cx="25" cy="62" rx="12" ry="24" fill="#d29a62" transform="rotate(16 25 62)"></ellipse><ellipse cx="95" cy="62" rx="12" ry="24" fill="#d29a62" transform="rotate(-16 95 62)"></ellipse><ellipse cx="60" cy="76" rx="18" ry="12" fill="#fff3e2"></ellipse><ellipse cx="45" cy="46" rx="5" ry="3" fill="#d29a62"></ellipse><ellipse cx="75" cy="46" rx="5" ry="3" fill="#d29a62"></ellipse><ellipse cx="45" cy="58" rx="8" ry="9.5" fill="#3a2418"></ellipse><ellipse cx="75" cy="58" rx="8" ry="9.5" fill="#3a2418"></ellipse><circle cx="42.5" cy="54.5" r="3.2" fill="#ffffff"></circle><circle cx="72.5" cy="54.5" r="3.2" fill="#ffffff"></circle><circle cx="48" cy="62" r="1.5" fill="#ffffff"></circle><circle cx="78" cy="62" r="1.5" fill="#ffffff"></circle><ellipse cx="32" cy="74" rx="7" ry="4" fill="#f59aa6" opacity=".6"></ellipse><ellipse cx="88" cy="74" rx="7" ry="4" fill="#f59aa6" opacity=".6"></ellipse><ellipse cx="60" cy="70" rx="7" ry="5" fill="#3a2418"></ellipse><ellipse cx="58" cy="68.5" rx="2" ry="1.2" fill="#ffffff" opacity=".7"></ellipse><path d="M60 75 V78 M60 78 Q55 82 51 78 M60 78 Q65 82 69 78" stroke="#3a2418" stroke-width="1.6" fill="none" stroke-linecap="round"></path><ellipse cx="60" cy="84" rx="4.5" ry="5.5" fill="#f08a9a"></ellipse>` }
	};

	let settings = { companion: 'cat', scene: 'auto', hemisphere: 'north', holidays: true, sound: true, previewDate: '' };
	let pet = PETS.cat;

	// ---------- Scene ----------
	document.getElementById('scene').innerHTML = `
<svg id="scene-svg" viewBox="0 0 400 250" role="img" aria-label="A cozy window with a pet on the windowsill">
	<defs>
		<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
			<stop id="sky-top" offset="0%" stop-color="#8fc8ea"></stop>
			<stop id="sky-bot" offset="100%" stop-color="#dff1fb"></stop>
		</linearGradient>
		<clipPath id="glass"><rect x="44" y="28" width="312" height="148"></rect></clipPath>
	</defs>

	<rect class="wall" x="0" y="0" width="400" height="250" rx="10"></rect>

	<rect x="30" y="14" width="340" height="176" rx="9" fill="#8a5a3c"></rect>
	<g clip-path="url(#glass)">
		<rect x="44" y="28" width="312" height="148" fill="url(#sky)"></rect>
		<circle id="sun" cx="290" cy="64" r="15" fill="#ffd36b"></circle>
		<g id="moon">
			<circle cx="300" cy="62" r="15" fill="#fff1c4"></circle>
			<circle id="moon-cut" cx="308" cy="55" r="13" fill="#1b1d4a"></circle>
		</g>
		<g id="stars" fill="#fff6d8">
			<circle class="twinkle" cx="96" cy="46" r="1.6"></circle>
			<circle class="twinkle" cx="150" cy="62" r="1.2" style="animation-delay:-1s"></circle>
			<circle class="twinkle" cx="232" cy="42" r="1.4" style="animation-delay:-2s"></circle>
			<circle class="twinkle" cx="262" cy="80" r="1.1" style="animation-delay:-.6s"></circle>
		</g>
		<path id="hill-far" d="M44 128 Q120 102 200 120 T356 110 V176 H44 Z"></path>
		<path id="hill-near" d="M44 150 Q140 130 230 146 T356 138 V176 H44 Z"></path>
		<g transform="translate(70,70)">
			<path d="M26 106 V40 M26 58 L10 42 M26 52 L42 36" stroke="#6b4632" stroke-width="6" stroke-linecap="round" fill="none"></path>
			<g id="canopy">
				<circle cx="26" cy="30" r="24"></circle>
				<circle cx="6" cy="44" r="16"></circle>
				<circle cx="46" cy="44" r="17"></circle>
			</g>
		</g>
	</g>
	<rect x="196" y="28" width="8" height="148" fill="#8a5a3c"></rect>
	<rect x="44" y="96" width="312" height="8" fill="#8a5a3c"></rect>

	<rect x="14" y="184" width="372" height="14" rx="4" fill="#8a5a3c"></rect>
	<rect x="18" y="196" width="364" height="8" rx="3" fill="#6a4128"></rect>

	<g transform="translate(36,138)">
		<path d="M20 34 C8 24 4 10 12 2 C18 10 20 22 20 34 Z" fill="#7fb39d"></path>
		<path d="M20 34 C32 24 36 10 28 2 C22 10 20 22 20 34 Z" fill="#a8d8c8"></path>
		<path d="M4 32 H36 L33 46 H7 Z" fill="#f2c4b0"></path>
	</g>

	<g id="pumpkin" transform="translate(88,154)">
		<ellipse cx="22" cy="20" rx="21" ry="14" fill="#e07a2e"></ellipse>
		<rect x="20" y="0" width="4" height="8" rx="2" fill="#4f7a62"></rect>
		<path d="M11 16 L16 12 L17 18 Z M33 16 L28 12 L27 18 Z M13 25 Q22 31 31 25" stroke="#5a2a10" stroke-width="2" fill="#5a2a10"></path>
	</g>
	<g id="xmas-tree" transform="translate(94,136)">
		<path d="M18 0 L32 20 H24 L34 36 H2 L12 20 H4 Z" fill="#4f7a62"></path>
		<rect x="14" y="36" width="8" height="12" rx="2" fill="#a5703c"></rect>
		<circle cx="18" cy="1" r="3" fill="#f5c451"></circle>
	</g>
	<g id="eggs" transform="translate(88,156)">
		<ellipse cx="14" cy="12" rx="7" ry="9" fill="#f4acb7"></ellipse>
		<ellipse cx="26" cy="9" rx="7" ry="9" fill="#a8d8c8"></ellipse>
		<ellipse cx="38" cy="12" rx="7" ry="9" fill="#f3dc8c"></ellipse>
		<path d="M4 16 H48 L43 30 H9 Z" fill="#c58b4e"></path>
	</g>

	<g transform="translate(318,140)">
		<g id="steam" fill="none" stroke="#efe7f2" stroke-width="2.4" stroke-linecap="round" opacity=".8">
			<path class="steam" d="M12 6 Q8 0 12 -6"></path>
			<path class="steam" d="M20 6 Q16 0 20 -6" style="animation-delay:1.2s"></path>
		</g>
		<path d="M4 10 H32 V36 Q32 44 18 44 Q4 44 4 36 Z" fill="#f6ead8"></path>
		<path d="M32 16 Q42 16 42 24 Q42 32 32 32" stroke="#f6ead8" stroke-width="4" fill="none"></path>
		<ellipse cx="18" cy="11" rx="14" ry="3" fill="#7a4a2e"></ellipse>
	</g>

	<g id="pet-sleep" transform="translate(142,99)"><g class="breathe" id="pet-sleep-art"></g></g>
	<g id="pet-awake" transform="translate(166,51) scale(0.9)" display="none"><g class="hop" id="pet-awake-art"></g></g>
	<g id="zz" fill="#c3b1e1" font-size="15" font-weight="700" font-family="sans-serif">
		<text class="zz" x="226" y="96">z</text>
		<text class="zz" x="238" y="86" font-size="12" style="animation-delay:1.5s">z</text>
	</g>

	<g id="bowl" display="none">
		<g id="food-fish" fill="#f2a05a">
			<path d="M156 172 Q162 166 168 172 Q162 176 156 172 Z M168 172 L172 168 L172 176 Z"></path>
			<path d="M170 169 Q176 163 182 169 Q176 173 170 169 Z M182 169 L186 165 L186 173 Z"></path>
		</g>
		<g id="food-bone" fill="#e9c48e">
			<path d="M158 170 h12 a3 3 0 1 1 0 4 h-12 a3 3 0 1 1 0 -4 Z"></path>
			<path d="M172 167 h12 a3 3 0 1 1 0 4 h-12 a3 3 0 1 1 0 -4 Z"></path>
		</g>
		<path d="M150 174 H196 Q194 186 173 186 Q152 186 150 174 Z" fill="#9fc4e8"></path>
	</g>
	<g id="hearts" display="none" fill="#f28ba8">
		<path class="heart" d="M210 44 c-3 -4 -9 -2 -6 3 l6 6 l6 -6 c3 -5 -3 -7 -6 -3 z"></path>
		<path class="heart" d="M232 36 c-2.5 -3 -7 -1.5 -5 2.5 l5 5 l5 -5 c2 -4 -2.5 -5.5 -5 -2.5 z" style="animation-delay:.6s"></path>
	</g>
</svg>`;

	const $ = (id) => document.getElementById(id);
	const show = (id, on) => $(id).setAttribute('display', on ? 'inline' : 'none');
	const set = (id, attr, value) => $(id).setAttribute(attr, value);

	// ---------- Seasons and holidays ----------
	function now() {
		if (settings.previewDate) {
			const d = new Date(settings.previewDate);
			if (!isNaN(d.getTime())) { return d; }
		}
		return new Date();
	}

	function easterSunday(y) {
		const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
		const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
		const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
		const n = h + l - 7 * m + 114;
		return new Date(y, Math.floor(n / 31) - 1, (n % 31) + 1);
	}

	function seasonOf(d) {
		const m = d.getMonth();
		const north = m >= 2 && m <= 4 ? 'spring' : m >= 5 && m <= 7 ? 'summer' : m >= 8 && m <= 10 ? 'autumn' : 'winter';
		if (settings.hemisphere !== 'south') { return north; }
		return { spring: 'autumn', summer: 'winter', autumn: 'spring', winter: 'summer' }[north];
	}

	function holidayOf(d) {
		if (!settings.holidays) { return 'none'; }
		const m = d.getMonth(), day = d.getDate();
		if (m === 9 && day >= 15) { return 'halloween'; }
		if (m === 11 && day <= 26) { return 'christmas'; }
		const today = new Date(d.getFullYear(), m, day);
		const diff = Math.round((today - easterSunday(d.getFullYear())) / 86400000);
		if (diff >= -7 && diff <= 1) { return 'easter'; }
		return 'none';
	}

	// A scene picked from the panel's toolbar wins over the calendar.
	const HOLIDAY_SEASON = { halloween: 'autumn', christmas: 'winter', easter: 'spring' };
	function pickScene(d) {
		const s = settings.scene;
		if (s === 'spring' || s === 'summer' || s === 'autumn' || s === 'winter') { return { season: s, holiday: 'none' }; }
		if (HOLIDAY_SEASON[s]) { return { season: HOLIDAY_SEASON[s], holiday: s }; }
		return { season: seasonOf(d), holiday: holidayOf(d) };
	}

	const SEASONS = {
		spring: { far: '#a9d79a', near: '#86c07a', tree: '#f2a7c3' },
		summer: { far: '#7cc06a', near: '#5ea74f', tree: '#4f9a45' },
		autumn: { far: '#d9a45e', near: '#c07c3e', tree: '#e9893a' },
		winter: { far: '#e7edf4', near: '#f6f8fc', tree: null }
	};

	function render() {
		const d = now();
		const h = d.getHours() + d.getMinutes() / 60;
		const night = h < 6 || h >= 20;
		const evening = !night && h >= 17;
		const { season, holiday } = pickScene(d);
		const look = SEASONS[season];

		const sky = night ? ['#1b1d4a', '#3b3170'] : evening ? ['#7a64a6', '#f2a07b'] : h < 8 ? ['#bfe0f2', '#fbd5c4'] : ['#8fc8ea', '#dff1fb'];
		set('sky-top', 'stop-color', sky[0]);
		set('sky-bot', 'stop-color', sky[1]);
		set('moon-cut', 'fill', sky[0]);
		show('sun', !night);
		show('moon', night);
		show('stars', night);

		set('hill-far', 'fill', night ? '#2f3558' : look.far);
		set('hill-near', 'fill', night ? (season === 'winter' ? '#9aa3c4' : '#262c48') : look.near);
		show('canopy', !!look.tree);
		if (look.tree) { set('canopy', 'fill', night ? '#3e3d63' : look.tree); }

		show('pumpkin', holiday === 'halloween');
		show('xmas-tree', holiday === 'christmas');
		show('eggs', holiday === 'easter');
	}

	function setPet(key) {
		pet = PETS[key] || PETS.cat;
		$('pet-sleep-art').innerHTML = pet.sleep;
		$('pet-awake-art').innerHTML = pet.awake;
		$('scene-svg').setAttribute('aria-label', 'A cozy window with ' + pet.name + ' on the windowsill');
	}

	// ---------- Pet behaviour ----------
	const messageEl = $('message');
	let timer = { visible: false, phase: 'idle', paused: false, remaining: 0, endsAt: 0, total: 0 };
	let awakeNow = false;
	let eating = false;
	let napTimeout;

	function updateText() {
		if (eating) {
			messageEl.textContent = pet.name + ' is munching a treat. Yum!';
		} else if (timer.paused) {
			messageEl.textContent = 'Paused. ' + pet.name + ' is keeping your seat warm.';
		} else if (timer.phase === 'focus') {
			messageEl.textContent = pet.name + ' is napping while you focus.';
		} else if (timer.phase === 'break') {
			messageEl.textContent = 'Break time! ' + pet.name + ' wants a little stretch.';
		} else {
			messageEl.textContent = awakeNow ? pet.name + ' woke up for a little stretch.' : pet.name + ' is napping by the window.';
		}
		$('timer-btn').hidden = !timer.visible;
		$('timer-btn').textContent = timer.phase === 'idle' ? 'Start focus' : timer.paused ? 'Resume' : 'Pause';
		$('end-btn').hidden = !timer.visible || timer.phase === 'idle';
		$('end-btn').textContent = timer.phase === 'break' ? 'Skip break' : 'End';
		$('feed-btn').textContent = 'Give ' + pet.name + ' a treat';
	}

	function setAwake(awake) {
		awakeNow = awake;
		show('pet-sleep', !awake);
		show('zz', !awake);
		show('pet-awake', awake);
		updateText();
	}

	const between = (min, max) => min + Math.random() * (max - min);

	// No timer running: long naps with short wake-ups.
	function napCycle() {
		setAwake(false);
		napTimeout = setTimeout(() => {
			setAwake(true);
			napTimeout = setTimeout(napCycle, between(4000, 7000));
		}, between(25000, 45000));
	}

	function settle() {
		clearTimeout(napTimeout);
		if (eating) { return; }
		if (timer.phase === 'idle') { napCycle(); } else { setAwake(timer.phase === 'break' && !timer.paused); }
	}

	// ---------- Treats ----------
	function feed() {
		if (eating) { return; }
		eating = true;
		clearTimeout(napTimeout);
		const cat = settings.companion !== 'dog';
		show('food-fish', cat);
		show('food-bone', !cat);
		show('bowl', true);
		show('hearts', true);
		setAwake(true);
		playSound();
		setTimeout(() => { show('food-fish', false); show('food-bone', false); }, 2800);
		setTimeout(() => {
			eating = false;
			show('bowl', false);
			show('hearts', false);
			settle();
		}, 5000);
	}

	// ---------- Focus timer display ----------
	const pad = (n) => String(n).padStart(2, '0');
	function tickTimer() {
		const left = timer.paused ? timer.remaining : Math.max(0, timer.endsAt - Date.now());
		const running = timer.phase !== 'idle' && timer.total > 0;
		const share = running ? left / timer.total : 1;
		$('focus-ui').hidden = !running;
		$('timer-label').textContent = timer.paused ? 'Paused' : timer.phase === 'break' ? 'Break' : 'Focusing';
		$('timer-time').textContent = running ? Math.floor(left / 60000) + ':' + pad(Math.floor((left % 60000) / 1000)) : '';
		$('timer-fill').style.width = (running ? (1 - share) * 100 : 0) + '%';
		$('timer-fill').className = timer.phase === 'break' ? 'break' : '';
		// The tea cools down while you focus.
		const steam = timer.phase === 'focus' ? share : timer.phase === 'break' ? 0.15 : 1;
		set('steam', 'opacity', (0.8 * steam).toFixed(2));
	}

	// ---------- Sounds ----------
	// A webview may only play sound after a click inside it,
	// so the first click on a button quietly unlocks both sounds.
	let soundsUnlocked = false;
	function unlockSounds() {
		if (soundsUnlocked) { return; }
		soundsUnlocked = true;
		// Only unlock the sound that is not about to play, so we never cut it off.
		const playing = settings.companion === 'dog' ? 'snd-dog' : 'snd-cat';
		['snd-cat', 'snd-dog'].filter((id) => id !== playing).forEach(prime);
	}
	function prime(id) {
		const audio = $(id);
		audio.muted = true;
		audio.play().then(() => { audio.pause(); audio.currentTime = 0; audio.muted = false; }).catch(() => { audio.muted = false; });
	}

	function playSound() {
		if (!settings.sound) { return; }
		const audio = $(settings.companion === 'dog' ? 'snd-dog' : 'snd-cat');
		audio.volume = 0.6;
		audio.currentTime = 0;
		audio.play().catch(() => { /* Sound file missing or blocked: stay quiet. */ });
	}

	// ---------- Buttons and messages ----------
	$('timer-btn').addEventListener('click', () => {
		unlockSounds();
		prime(settings.companion === 'dog' ? 'snd-dog' : 'snd-cat');
		const type = timer.phase === 'idle' ? 'start' : timer.paused ? 'resume' : 'pause';
		vscode.postMessage({ type });
	});
	$('end-btn').addEventListener('click', () => vscode.postMessage({ type: 'stop' }));
	$('feed-btn').addEventListener('click', () => { unlockSounds(); feed(); });

	window.addEventListener('message', (event) => {
		const msg = event.data;
		if (msg.type === 'config') {
			const petChanged = msg.companion !== settings.companion;
			settings = msg;
			if (petChanged) { setPet(settings.companion); }
			render();
			updateText();
		} else if (msg.type === 'timer') {
			timer = msg;
			settle();
			updateText();
			tickTimer();
		} else if (msg.type === 'sound') {
			playSound();
		} else if (msg.type === 'feed') {
			feed();
		}
	});

	// ---------- Start ----------
	setPet(settings.companion);
	render();
	settle();
	tickTimer();
	setInterval(render, 60000);
	setInterval(tickTimer, 1000);

	vscode.postMessage({ type: 'ready' });
})();