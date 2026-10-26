'use strict';
/* Спорт-таймер — интервальный таймер (PWA). Без библиотек, данные хранятся только на телефоне. */
(() => {
  const APP_VERSION = '1.0.1';
  const LS_SETTINGS = 'tmr.settings';
  const LS_TEMPLATES = 'tmr.templates';

  const $ = (s, r = document) => r.querySelector(s);
  const app = $('#app');
  const layer = $('#layer');

  /* ================= Иконки ================= */
  const P = {
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 8.96 4.6H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v.04a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15z"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
    share: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 19h14"/>',
    upload: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 19h14"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    top: '<path d="M5 4h14M12 20V9M7 13l5-5 5 5"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.6"/><path d="M4 4v4.6h4.6"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M3 3l18 18M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    vol: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    rounds: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
    tabata: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    emom: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
    amrap: '<path d="M12 3c1 4 6 5.5 6 11a6 6 0 0 1-12 0c0-3 1.5-4.5 3-6 0 2 1 3.5 2.5 3.5C11.5 8.5 10.5 6 12 3z"/>',
    countdown: '<path d="M6 2h12M6 22h12M7 2v4a5 5 0 0 0 10 0V2M7 22v-4a5 5 0 0 1 10 0v4"/>',
    custom: '<path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5"/>',
    stopwatch: '<circle cx="12" cy="14" r="8"/><path d="M12 10v4M10 2h4M18.5 6.5l1.5-1.5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    restore: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>'
  };
  const FILLED = {
    play: '<path d="M7 4.6v14.8a1 1 0 0 0 1.52.86l12.2-7.4a1 1 0 0 0 0-1.72L8.52 3.74A1 1 0 0 0 7 4.6z"/>',
    pause: '<rect x="5" y="4" width="5" height="16" rx="1.6"/><rect x="14" y="4" width="5" height="16" rx="1.6"/>',
    next: '<path d="M4 5.6v12.8a1 1 0 0 0 1.53.85L15 13.4V18a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H16a1 1 0 0 0-1 1v4.6L5.53 4.75A1 1 0 0 0 4 5.6z"/>',
    prev: '<path d="M20 5.6v12.8a1 1 0 0 1-1.53.85L9 13.4V18a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1H8a1 1 0 0 1 1 1v4.6l9.47-5.85A1 1 0 0 1 20 5.6z"/>',
    more: '<circle cx="5" cy="12" r="2.3"/><circle cx="12" cy="12" r="2.3"/><circle cx="19" cy="12" r="2.3"/>'
  };
  const I = (n) => FILLED[n]
    ? `<svg class="i fill" viewBox="0 0 24 24" aria-hidden="true">${FILLED[n]}</svg>`
    : `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

  /* ================= Справочники ================= */
  const TYPES = {
    rounds:    { name: 'Раунды',      desc: 'Работа / отдых × N, подходы' },
    tabata:    { name: 'Табата',      desc: '20 / 10 × 8 или свой вариант' },
    emom:      { name: 'EMOM',        desc: 'Новый подход каждую минуту' },
    amrap:     { name: 'AMRAP',       desc: 'Максимум кругов за время' },
    countdown: { name: 'Отсчёт',      desc: 'Простой обратный отсчёт' },
    custom:    { name: 'Конструктор', desc: 'Свои шаги и блоки с повторами' },
    stopwatch: { name: 'Секундомер',  desc: 'Прямой счёт с кругами' }
  };
  const DMAX = 5 * 3600;
  const KINDS = { work: 'Работа', rest: 'Отдых', prep: 'Подготовка', warm: 'Разминка', cool: 'Заминка', other: 'Другое' };

  const DEFAULT_SETTINGS = {
    preSignal: 10, preWork: true, preRest: true, halfway: false,
    sound: true, volume: 1, vibrate: true, flash: true,
    theme: 'auto', textScale: 1, phaseBg: false, keepAwake: 'always', confirmStop: true
  };

  /* ================= Хранилище ================= */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { toast('Не удалось сохранить на устройстве'); return false; } }
  };
  let S = Object.assign({}, DEFAULT_SETTINGS, store.get(LS_SETTINGS, {}));
  let T = store.get(LS_TEMPLATES, null);
  const saveS = () => store.set(LS_SETTINGS, S);
  const saveT = () => store.set(LS_TEMPLATES, T);

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad = (n) => String(n).padStart(2, '0');

  function fmt(sec) {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }

  function defaultsFor(type) {
    return {
      rounds:    { prep: 10, warm: 0, work: 180, rest: 60, rounds: 5, sets: 1, setRest: 120, cool: 0 },
      tabata:    { prep: 10, warm: 0, work: 20, rest: 10, rounds: 8, sets: 1, setRest: 60, cool: 0 },
      emom:      { prep: 10, interval: 60, rounds: 10 },
      amrap:     { prep: 10, duration: 720 },
      countdown: { prep: 0, duration: 180 },
      custom:    { prep: 10, blocks: [{ name: 'Блок 1', repeat: 3, steps: [{ name: 'Работа', kind: 'work', dur: 40 }, { name: 'Отдых', kind: 'rest', dur: 20 }] }] },
      stopwatch: { beepEvery: 0 }
    }[type];
  }
  function newTemplate(type) {
    return { id: uid(), type, name: TYPES[type].name, pre: type === 'tabata' ? 3 : null, p: defaultsFor(type), created: Date.now(), updated: Date.now() };
  }
  function presets() {
    const L = [];
    const a = (type, name, p, pre) => { const t = newTemplate(type); t.name = name; Object.assign(t.p, p); if (pre !== undefined) t.pre = pre; L.push(t); };
    a('countdown', 'Отдых между подходами', { prep: 0, duration: 180 });
    a('tabata', 'Табата 20/10 × 8', {});
    a('rounds', 'Спарринги 5 × 5:00', { work: 300, rest: 60, rounds: 5 });
    a('rounds', 'Аэробайк: спринты 10 с', { warm: 300, work: 10, rest: 110, rounds: 6, cool: 180 });
    a('emom', 'EMOM 10 минут', {});
    a('amrap', 'AMRAP 12 минут', {});
    a('custom', 'Круговая: 3 круга', {
      blocks: [
        { name: 'Разминка', repeat: 1, steps: [{ name: 'Разминка', kind: 'warm', dur: 300 }] },
        { name: 'Круг', repeat: 3, steps: [
          { name: 'Приседания', kind: 'work', dur: 40 }, { name: 'Отдых', kind: 'rest', dur: 20 },
          { name: 'Отжимания', kind: 'work', dur: 40 }, { name: 'Отдых', kind: 'rest', dur: 20 },
          { name: 'Планка', kind: 'work', dur: 40 }, { name: 'Отдых', kind: 'rest', dur: 60 }
        ] },
        { name: 'Заминка', repeat: 1, steps: [{ name: 'Заминка', kind: 'cool', dur: 180 }] }
      ]
    });
    a('stopwatch', 'Секундомер', {});
    return L;
  }
  if (!Array.isArray(T)) { T = presets(); saveT(); }
  else { const seen = new Set(); T = T.map(normalizeTemplate).filter(Boolean).map((t) => { if (seen.has(t.id)) t.id = uid(); seen.add(t.id); return t; }); }
  S = normalizeSettings(S);
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  /* ================= Сборка программы ================= */
  function seg(kind, dur, label, info) { return { kind, dur, label: label || KINDS[kind], info: info || '' }; }
  function compile(t) {
    const p = t.p, out = [];
    if (t.type === 'stopwatch') return { mode: 'sw', segs: [], total: 0 };
    if (p.prep > 0) out.push(seg('prep', p.prep, 'Подготовка'));
    switch (t.type) {
      case 'rounds': case 'tabata': {
        if (p.warm > 0) out.push(seg('warm', p.warm));
        const R = p.rounds, N = p.sets;
        for (let s = 1; s <= N; s++) for (let r = 1; r <= R; r++) {
          const info = `Раунд ${r} / ${R}` + (N > 1 ? ` · Подход ${s} / ${N}` : '');
          out.push(seg('work', p.work, null, info));
          if (r < R) { if (p.rest > 0) out.push(seg('rest', p.rest, null, info)); }
          else if (s < N) { const d = p.setRest > 0 ? p.setRest : p.rest; if (d > 0) out.push(seg('rest', d, 'Отдых', `Между подходами · ${s} / ${N}`)); }
        }
        if (p.cool > 0) out.push(seg('cool', p.cool));
        break;
      }
      case 'emom':
        for (let r = 1; r <= p.rounds; r++) out.push(seg('work', p.interval, 'Работа', `${p.interval === 60 ? 'Минута' : 'Интервал'} ${r} / ${p.rounds}`));
        break;
      case 'amrap': out.push(seg('work', p.duration, 'Работа', 'Максимум кругов')); break;
      case 'countdown': out.push(seg('work', p.duration, 'Таймер', '')); break;
      case 'custom':
        for (const b of p.blocks) for (let r = 1; r <= b.repeat; r++) for (const st of b.steps) {
          if (st.dur > 0) out.push(seg(st.kind, st.dur, st.name || KINDS[st.kind], (b.name || 'Блок') + (b.repeat > 1 ? ` · ${r} / ${b.repeat}` : '')));
        }
        break;
    }
    let acc = 0;
    out.forEach((s) => { s.start = acc; acc += s.dur; });
    return { mode: 'seq', segs: out, total: acc };
  }
  const preFor = (t) => (t.pre === null || t.pre === undefined ? S.preSignal : t.pre);

  const preAllowed = (s, n) => n > 0 && s.dur > n && ((s.kind === 'rest' || s.kind === 'prep') ? S.preRest : S.preWork);
  function buildEvents(c, t) {
    const n = preFor(t), ev = [];
    c.segs.forEach((s, i) => {
      const end = s.start + s.dur;
      if (preAllowed(s, n)) ev.push({ t: end - n, type: 'short' });
      if (S.halfway && s.kind === 'work' && s.dur >= 30) ev.push({ t: s.start + s.dur / 2, type: 'short' });
      ev.push({ t: end, type: i === c.segs.length - 1 ? 'finish' : 'long' });
    });
    if (c.segs.length && c.segs[0].kind !== 'prep') ev.push({ t: 0, type: 'long' });
    ev.sort((a, b) => a.t - b.t);
    // одно событие на один момент времени (длинный сигнал важнее короткого)
    const rank = { short: 0, long: 1, finish: 2 }, out = [];
    for (const e of ev) {
      const last = out[out.length - 1];
      if (last && Math.abs(last.t - e.t) < 0.05) { if (rank[e.type] > rank[last.type]) out[out.length - 1] = e; }
      else out.push(e);
    }
    return out;
  }

  function summaryText(t) {
    const p = t.p;
    switch (t.type) {
      case 'rounds': case 'tabata':
        return `${p.rounds} × ${fmt(p.work)} / ${fmt(p.rest)}` + (p.sets > 1 ? ` · ${p.sets} подх.` : '');
      case 'emom': return `${p.rounds} × ${fmt(p.interval)}`;
      case 'amrap': return `${fmt(p.duration)} на максимум`;
      case 'countdown': return `Отсчёт ${fmt(p.duration)}`;
      case 'custom': { const n = compile(t).segs.length; return `${p.blocks.length} ${plural(p.blocks.length, 'блок', 'блока', 'блоков')} · ${n} ${plural(n, 'шаг', 'шага', 'шагов')}`; }
      case 'stopwatch': return p.beepEvery > 0 ? `Сигнал каждые ${fmt(p.beepEvery)}` : 'Прямой счёт, круги';
    }
    return '';
  }
  function plural(n, a, b, c) { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c; }
  function stripHTML(c) {
    if (!c.segs.length) return '';
    return `<div class="strip" aria-hidden="true">${c.segs.slice(0, 400).map((s) => `<i style="flex:${s.dur};background:var(--${s.kind})"></i>`).join('')}</div>`;
  }

  /* ================= Звук ================= */
  const Snd = {
    ctx: null, gain: null, buf: {}, srcs: new Set(), loading: null, html: {},
    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC({ latencyHint: 'interactive' });
        this.gain = this.ctx.createGain();
        this.gain.gain.value = S.volume;
        this.gain.connect(this.ctx.destination);
        this.ctx.onstatechange = () => { if (RUN && RUN.running) schedule(); };
        this.loading = Promise.all(['short', 'long'].map((n) =>
          fetch(`sounds/${n}.wav`).then((r) => r.arrayBuffer())
            .then((a) => new Promise((ok, no) => this.ctx.decodeAudioData(a, ok, no)))
            .then((b) => { this.buf[n] = b; })
        )).catch((e) => console.warn('sound', e));
      } catch (e) { this.ctx = null; }
    },
    async unlock() {
      this.init();
      if (this.ctx && this.ctx.state !== 'running') { try { await this.ctx.resume(); } catch (e) {} }
      if (this.loading) await this.loading;
    },
    get ready() { return !!(this.ctx && this.ctx.state === 'running' && this.buf.short && this.buf.long); },
    play(type, when) {
      if (!S.sound) return;
      if (!this.ready) { this.fallback(type); return; }
      const t0 = Math.max(when || 0, this.ctx.currentTime);
      const one = (name, at) => {
        const src = this.ctx.createBufferSource();
        src.buffer = this.buf[name];
        src.connect(this.gain);
        src.start(at);
        this.srcs.add(src);
        src.onended = () => this.srcs.delete(src);
      };
      if (type === 'short') one('short', t0);
      else { one('long', t0); if (type === 'finish') one('long', t0 + 1.1); }
    },
    fallback(type) {
      const name = type === 'short' ? 'short' : 'long';
      try {
        const a = this.html[name] || (this.html[name] = new Audio(`sounds/${name}.wav`));
        a.volume = S.volume; a.currentTime = 0; a.play().catch(() => {});
      } catch (e) {}
    },
    cancel() { this.srcs.forEach((s) => { try { s.stop(); } catch (e) {} }); this.srcs.clear(); },
    setVol(v) { if (this.gain) this.gain.gain.value = v; }
  };

  /* ================= Экран не гаснет ================= */
  let wl = null, wlBusy = false, wlAgain = false;
  async function wake() {
    if (!('wakeLock' in navigator)) { updAwake(); return; }
    const need = S.keepAwake === 'always' || state.screen === 'run';
    if (wlBusy) { wlAgain = true; return; }
    wlBusy = true;
    try {
      if (need && !wl && document.visibilityState === 'visible') {
        wl = await navigator.wakeLock.request('screen');
        wl.addEventListener('release', () => { wl = null; updAwake(); });
      } else if (!need && wl) {
        await wl.release(); wl = null;
      }
    } catch (e) { /* нет разрешения или вкладка скрыта */ }
    wlBusy = false;
    updAwake();
    if (wlAgain) { wlAgain = false; wake(); }
  }
  function updAwake() {
    const el = $('#awake');
    if (el) { el.innerHTML = I(wl ? 'eye' : 'eyeoff'); el.title = wl ? 'Экран не погаснет' : 'Экран может погаснуть'; }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      wake();
      if (RUN && RUN.running) { Snd.unlock().finally(() => { if (RUN && RUN.running) { schedule(); loop(); } }); }
    }
  });

  /* ================= Сигналы (вибрация, вспышка) ================= */
  const flashEl = $('#flash');
  function cue(type, withSound) {
    if (withSound) Snd.play(type);
    if (S.vibrate && navigator.vibrate) {
      navigator.vibrate(type === 'short' ? 150 : type === 'long' ? 500 : [450, 150, 450, 150, 800]);
    }
    if (S.flash) { flashEl.classList.remove('go'); void flashEl.offsetWidth; flashEl.classList.add('go'); }
  }

  /* ================= Движок тренировки ================= */
  let RUN = null;
  const nowMs = () => performance.now();
  const elapsed = () => (RUN.running ? RUN.base + (nowMs() - RUN.resumeAt) : RUN.base);

  function startRun(t) {
    const tt = clone(t);
    const c = compile(tt);
    if (c.mode === 'seq' && c.total <= 0) { toast('В таймере нет ни одной фазы'); return; }
    RUN = { t: tt, c, events: c.mode === 'seq' ? buildEvents(c, tt) : [], base: 0, resumeAt: 0, running: false, done: false,
      evIdx: 0, schedIdx: 0, sCtx: 0, sEl: 0, seg: -1, amrap: 0, amrapSplits: [], laps: [], nextBeep: 0, raf: 0, lastDig: '' };
    const orig = T.find((x) => x.id === t.id);
    if (orig) { orig.lastUsed = Date.now(); saveT(); }
    go('run');
    const p = Snd.unlock();
    p.finally(() => { if (RUN && !RUN.running && !RUN.done && RUN.base === 0) resume(); });
  }

  function resume() {
    if (!RUN || RUN.done) return;
    Snd.unlock().finally(() => {
      if (!RUN || RUN.running || RUN.done) return;
      RUN.resumeAt = nowMs();
      RUN.running = true;
      if (RUN.c.mode === 'sw' && RUN.t.p.beepEvery > 0 && !RUN.nextBeep) RUN.nextBeep = RUN.t.p.beepEvery;
      schedule();
      renderRun();
      loop();
    });
  }
  function pause() {
    if (!RUN || !RUN.running) return;
    RUN.base = elapsed();
    RUN.running = false;
    Snd.cancel();
    renderRun();
  }
  function seek(ms) {
    if (!RUN || RUN.c.mode !== 'seq') return;
    ms = clamp(ms, 0, RUN.c.total * 1000);
    RUN.base = ms;
    RUN.resumeAt = nowMs();
    RUN.evIdx = RUN.events.findIndex((e) => e.t * 1000 > ms + 1);
    if (RUN.evIdx < 0) RUN.evIdx = RUN.events.length;
    RUN.seg = -1;
    schedule();
    if (ms >= RUN.c.total * 1000) { finish(); return; }
    renderRun();
    if (!RUN.running) paint(ms);
  }
  function schedule() {
    Snd.cancel();
    if (RUN) RUN.sched = false;
    if (!RUN || !RUN.running || !S.sound || !Snd.ready || RUN.c.mode !== 'seq') return;
    RUN.sched = true;
    const e = elapsed();
    RUN.sCtx = Snd.ctx.currentTime + 0.02;
    RUN.sEl = e + 20;
    RUN.schedIdx = RUN.evIdx;
    extend(e);
  }
  function extend(e) {
    if (!Snd.ready || !S.sound || RUN.c.mode !== 'seq') return;
    const horizon = e + 10 * 60 * 1000;
    while (RUN.schedIdx < RUN.events.length && RUN.events[RUN.schedIdx].t * 1000 <= horizon) {
      const ev = RUN.events[RUN.schedIdx++];
      const when = RUN.sCtx + (ev.t * 1000 - RUN.sEl) / 1000;
      if (when >= Snd.ctx.currentTime - 0.08) Snd.play(ev.type, when);
    }
  }
  setInterval(() => { if (RUN && RUN.running && RUN.sched && RUN.c.mode === 'seq') extend(elapsed()); }, 1000);
  function loop() {
    cancelAnimationFrame(RUN && RUN.raf);
    if (RUN && RUN.running) RUN.raf = requestAnimationFrame(tick);
  }
  function tick() {
    if (!RUN || !RUN.running || state.screen !== 'run') return;
    const e = elapsed();
    if (RUN.c.mode === 'seq') {
      while (RUN.evIdx < RUN.events.length && RUN.events[RUN.evIdx].t * 1000 <= e) {
        const ev = RUN.events[RUN.evIdx++];
        // звук уже запланирован заранее; здесь вибрация, вспышка и запасной звук
        if (e - ev.t * 1000 < 1500) cue(ev.type, !Snd.ready);
      }
      if (e >= RUN.c.total * 1000) { finish(); return; }
      if (!RUN.sched && S.sound && Snd.ready) schedule(); else extend(e);
    } else if (RUN.nextBeep && e >= RUN.nextBeep * 1000) {
      cue('long', true);
      RUN.nextBeep += RUN.t.p.beepEvery;
    }
    paint(e);
    RUN.raf = requestAnimationFrame(tick);
  }
  function finish() {
    RUN.base = RUN.c.total * 1000;
    RUN.running = false;
    RUN.done = true;
    cancelAnimationFrame(RUN.raf);
    renderRun();
  }
  function segAt(ms) {
    const segs = RUN.c.segs, sec = ms / 1000;
    let i = RUN.seg >= 0 && RUN.seg < segs.length && segs[RUN.seg].start <= sec ? RUN.seg : 0;
    while (i < segs.length - 1 && sec >= segs[i].start + segs[i].dur) i++;
    return i;
  }
  function digitsHTML(str) {
    return str.split('').map((ch) => (ch === ':' ? '<span class="c">:</span>' : ch === '.' ? '<span class="c">.</span>' : `<span class="d">${ch}</span>`)).join('');
  }
  function setDigits(str, warn) {
    const el = $('#dig');
    if (!el) return;
    if (RUN.lastDig !== str) { el.innerHTML = digitsHTML(str); RUN.lastDig = str; el.classList.toggle('mid', str.length === 5); el.classList.toggle('long', str.length > 5); }
    el.classList.toggle('warn', !!warn);
  }
  function paint(e) {
    if (RUN.c.mode === 'sw') {
      const s = Math.floor(e / 1000), tenth = Math.floor((e % 1000) / 100);
      const str = fmt(s);
      const el = $('#dig');
      if (el) {
        const html = digitsHTML(str) + `<span class="d ms">.${tenth}</span>`;
        if (RUN.lastDig !== html) { el.innerHTML = html; RUN.lastDig = html; el.classList.toggle('mid', str.length === 4); el.classList.toggle('long', str.length >= 5); }
      }
      return;
    }
    const i = segAt(e);
    if (i !== RUN.seg) { RUN.seg = i; renderRun(); return; }
    const s = RUN.c.segs[i];
    const endMs = (s.start + s.dur) * 1000;
    const left = Math.max(0, Math.ceil((endMs - e) / 1000 - 1e-6));
    const n = preFor(RUN.t);
    setDigits(fmt(left), preAllowed(s, n) && left <= n);
    const bar = $('#bar');
    if (bar) bar.style.width = `${clamp((e / 1000 - s.start) / s.dur, 0, 1) * 100}%`;
    const foot = $('#foot');
    if (foot) {
      const txt = RUN.running
        ? `Осталось ${fmt(Math.ceil(RUN.c.total - e / 1000))} · прошло ${fmt(Math.floor(e / 1000))}`
        : `Пауза · осталось ${fmt(Math.ceil(RUN.c.total - e / 1000))}`;
      if (foot.textContent !== txt) foot.textContent = txt;
    }
  }

  /* ================= Навигация ================= */
  const state = { screen: 'home', draft: null, isNew: false, dirty: false };
  history.replaceState({ screen: 'home' }, '');
  function go(screen) {
    state.screen = screen;
    history.pushState({ screen }, '');
    render();
    window.scrollTo(0, 0);
    wake();
  }
  let allowPop = false;
  function leave() { allowPop = true; history.back(); }
  window.addEventListener('popstate', (e) => {
    if (skipPop > 0) { skipPop--; const w = popWaiters.shift(); if (w) w(); return; }
    if (layerOpen) { layer.innerHTML = ''; layerActs = {}; layerOpen = false; return; }
    if (!allowPop) {
      if (state.screen === 'run' && RUN && !RUN.done && (RUN.running || RUN.base > 0)) {
        history.pushState({ screen: 'run' }, ''); askStop(); return;
      }
      if (state.screen === 'edit' && state.dirty) {
        history.pushState({ screen: 'edit' }, ''); askDiscard(); return;
      }
    }
    allowPop = false;
    if (state.screen === 'run' && RUN) { cancelAnimationFrame(RUN.raf); Snd.cancel(); RUN = null; }
    state.screen = (e.state && e.state.screen) || 'home';
    if (state.screen === 'run' && !RUN) state.screen = 'home';
    if (state.screen === 'edit' && !state.draft) state.screen = 'home';
    render();
    wake();
  });

  /* ================= Слой: шторки, диалоги, тост ================= */
  // У каждого окна своя запись в истории: системная кнопка «Назад» закрывает окно, а не приложение
  let layerActs = {}, layerOpen = false, skipPop = 0;
  const popWaiters = [];
  function openLayer(html, acts = {}) {
    if (!layerOpen) history.pushState({ screen: state.screen, layer: 1 }, '');
    layerOpen = true; layer.innerHTML = html; layerActs = acts;
  }
  function closeLayer() {
    return new Promise((res) => {
      layer.innerHTML = ''; layerActs = {};
      if (!layerOpen) { res(); return; }
      layerOpen = false; skipPop++; popWaiters.push(res); history.back();
    });
  }
  function sheet(title, items) {
    // items: [{icon,label,hint,act,danger}]
    const acts = {};
    const html = items.map((it, i) => { acts['it' + i] = it.act; return `<button class="btn-line" data-act="it${i}" ${it.danger ? 'style="color:var(--danger)"' : ''}>${it.icon ? I(it.icon) : ''}<span>${esc(it.label)}${it.hint ? `<small>${esc(it.hint)}</small>` : ''}</span></button>`; }).join('');
    openLayer(`<div class="backdrop" data-act="close"><div class="sheet" role="dialog" aria-label="${esc(title)}"><div class="grab"></div>${title ? `<h2>${esc(title)}</h2>` : ''}${html}</div></div>`,
      Object.fromEntries(Object.entries(acts).map(([k, f]) => [k, () => { closeLayer().then(f); }])));
  }
  function confirmBox(title, text, okLabel, onOk, danger) {
    openLayer(`<div class="backdrop center" data-act="close"><div class="dialog" role="alertdialog"><h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ''}
      <div class="actions two"><button class="btn" data-act="close">Отмена</button><button class="btn primary" data-act="ok" ${danger ? 'style="background:var(--danger);color:#fff"' : ''}>${esc(okLabel)}</button></div></div></div>`,
      { ok: () => { closeLayer().then(onOk); } });
  }
  let toastTimer = 0;
  function toast(msg, ms = 2600, onTap) {
    const el = $('#toast');
    el.textContent = msg;
    el.onclick = onTap ? () => { el.classList.remove('show'); onTap(); } : null;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms);
  }

  function askDuration(title, val, max, onOk) {
    const m = Math.floor(val / 60), s = val % 60;
    const chips = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 300, 600].filter((v) => v <= max);
    openLayer(`<div class="backdrop center" data-act="close"><div class="dialog" role="dialog"><h2>${esc(title)}</h2>
      <div class="dur-in"><label><input id="dm" type="text" inputmode="numeric" maxlength="3" value="${m}" aria-label="Минуты">мин</label><span class="colon">:</span><label><input id="ds" type="text" inputmode="numeric" maxlength="2" value="${pad(s)}" aria-label="Секунды">сек</label></div>
      <div class="chips">${chips.map((v) => `<button data-act="chip" data-v="${v}">${fmt(v)}</button>`).join('')}</div>
      <div class="actions two"><button class="btn" data-act="close">Отмена</button><button class="btn primary" data-act="ok">Готово</button></div></div></div>`, {
      chip: (el) => { const v = +el.dataset.v; $('#dm').value = Math.floor(v / 60); $('#ds').value = pad(v % 60); },
      ok: () => {
        const v = (parseInt($('#dm').value, 10) || 0) * 60 + (parseInt($('#ds').value, 10) || 0);
        closeLayer().then(() => onOk(clamp(v, 0, max)));
      }
    });
    const dm = $('#dm');
    layer.querySelectorAll('.dur-in input').forEach((inp) => inp.addEventListener('focus', () => inp.select()));
    setTimeout(() => { dm.focus(); dm.select(); }, 60);
  }
  function askNumber(title, val, min, max, onOk) {
    openLayer(`<div class="backdrop center" data-act="close"><div class="dialog" role="dialog"><h2>${esc(title)}</h2>
      <div class="dur-in"><label><input id="dn" type="text" inputmode="numeric" maxlength="3" value="${val}" aria-label="${esc(title)}"></label></div>
      <div class="actions two"><button class="btn" data-act="close">Отмена</button><button class="btn primary" data-act="ok">Готово</button></div></div></div>`, {
      ok: () => { const v = parseInt($('#dn').value, 10); closeLayer().then(() => onOk(clamp(isNaN(v) ? val : v, min, max))); }
    });
    setTimeout(() => { const d = $('#dn'); d.focus(); d.select(); }, 60);
  }

  /* ================= Отрисовка ================= */
  function render() {
    document.documentElement.dataset.theme = S.theme;
    document.documentElement.style.setProperty('--scale', S.textScale);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#000';
    if (state.screen === 'home') renderHome();
    else if (state.screen === 'edit') renderEdit();
    else if (state.screen === 'settings') renderSettings();
    else if (state.screen === 'run') renderRun();
  }

  // ---------- Главная ----------
  function renderHome() {
    const cards = T.map((t) => {
      const c = compile(t);
      return `<article class="card">
        <div><div class="badge">${esc(TYPES[t.type].name)}</div><div class="name">${esc(t.name)}</div>
          <div class="meta">${esc(summaryText(t))}${c.mode === 'seq' ? ` · <span class="total">${fmt(c.total)}</span>` : ''}</div></div>
        <div class="side"><button class="play-btn" data-act="start" data-id="${t.id}" aria-label="Старт: ${esc(t.name)}">${I('play')}</button>
          <button class="more-btn" data-act="menu" data-id="${t.id}" aria-label="Действия">${I('more')}</button></div>
        ${stripHTML(c)}
      </article>`;
    }).join('');
    app.innerHTML = `<div class="screen">
      <header class="topbar"><h1>Таймеры</h1><button class="icon-btn" data-act="settings" aria-label="Настройки">${I('gear')}</button></header>
      <main class="list">${cards || '<div class="empty">Пока нет ни одного таймера.<br>Нажмите «Новый таймер».</div>'}</main>
      <div class="fab-wrap"><button class="fab" data-act="new">${I('plus')} Новый таймер</button></div>
    </div>`;
  }

  // ---------- Редактор ----------
  const durStep = (v, dir) => {
    const s = (dir > 0 ? v : v - 1) < 60 ? 5 : (dir > 0 ? v : v - 1) < 300 ? 15 : (dir > 0 ? v : v - 1) < 1200 ? 30 : 60;
    if (dir > 0) return Math.floor(v / s) * s + s;
    return Math.ceil(v / s) * s - s;
  };
  function getPath(root, path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), root); }
  function setPath(root, path, v) { const ks = path.split('.'); const last = ks.pop(); const o = ks.reduce((a, k) => a[k], root); o[last] = v; }
  const rootOf = (r) => (r === 'S' ? S : state.draft);

  function fmtVal(kind, v, unit) {
    if (kind === 'dur') return fmt(v);
    return unit ? `${v} ${unit}` : String(v);
  }
  function stepper(root, path, kind, min, max, title, unit = '') {
    const v = getPath(rootOf(root), path);
    return `<div class="stepper" data-root="${root}" data-path="${path}" data-kind="${kind}" data-min="${min}" data-max="${max}" data-title="${esc(title)}" data-unit="${unit}">
      <button class="pm" data-act="dec" aria-label="Меньше">${I('minus')}</button>
      <button class="val" data-act="input" aria-label="${esc(title)}: ввести значение">${fmtVal(kind, v, unit)}</button>
      <button class="pm" data-act="inc" aria-label="Больше">${I('plus')}</button></div>`;
  }
  function row(label, control, hint, kind) {
    return `<div class="row"><div class="lbl"><span class="lt">${kind ? `<span class="dot" style="background:var(--${kind})"></span>` : ''}<span>${esc(label)}</span></span>${hint ? `<small>${esc(hint)}</small>` : ''}</div>${control}</div>`;
  }
  const dRow = (label, path, min, kind, hint) => row(label, stepper('D', path, 'dur', min, DMAX, label), hint, kind);
  const nRow = (label, path, min, max, hint) => row(label, stepper('D', path, 'num', min, max, label), hint);
  function switchHTML(root, path, on) {
    return `<label class="switch"><input type="checkbox" data-switch="${root}:${path}" ${on ? 'checked' : ''}><span></span></label>`;
  }

  function editFields() {
    const d = state.draft, p = d.p;
    let h = '';
    switch (d.type) {
      case 'rounds': case 'tabata':
        h += `<div class="group">${dRow('Работа', 'p.work', 1, 'work')}${dRow('Отдых', 'p.rest', 0, 'rest')}${nRow('Раунды', 'p.rounds', 1, 999)}</div>`;
        h += `<div class="group-title">Подходы</div><div class="group">${nRow('Подходы', 'p.sets', 1, 99, 'Сколько раз повторить все раунды')}${dRow('Отдых между подходами', 'p.setRest', 0, 'rest')}</div>`;
        h += `<div class="group-title">Начало и конец</div><div class="group">${dRow('Подготовка', 'p.prep', 0, 'prep', 'Отсчёт перед стартом')}${dRow('Разминка', 'p.warm', 0, 'warm')}${dRow('Заминка', 'p.cool', 0, 'cool')}</div>`;
        break;
      case 'emom':
        h += `<div class="group">${dRow('Интервал', 'p.interval', 5, 'work', 'Обычно 1:00')}${nRow('Количество', 'p.rounds', 1, 999)}${dRow('Подготовка', 'p.prep', 0, 'prep')}</div>`;
        break;
      case 'amrap':
        h += `<div class="group">${dRow('Время', 'p.duration', 5, 'work')}${dRow('Подготовка', 'p.prep', 0, 'prep')}</div>`;
        break;
      case 'countdown':
        h += `<div class="group">${dRow('Время', 'p.duration', 1, 'work')}${dRow('Подготовка', 'p.prep', 0, 'prep')}</div>`;
        break;
      case 'stopwatch':
        h += `<div class="group">${dRow('Сигнал каждые', 'p.beepEvery', 0, null, '0:00 — без сигналов')}</div>`;
        break;
      case 'custom':
        h += `<div class="group">${dRow('Подготовка', 'p.prep', 0, 'prep', 'Отсчёт перед стартом')}</div>`;
        p.blocks.forEach((b, bi) => {
          const bp = `p.blocks.${bi}`;
          h += `<section class="block">
            <div class="block-head"><input type="text" data-bind="${bp}.name" value="${esc(b.name)}" aria-label="Название блока" placeholder="Название блока">
              <button class="icon-btn" data-act="blockMenu" data-b="${bi}" aria-label="Действия с блоком">${I('more')}</button></div>
            ${row('Повторить', stepper('D', `${bp}.repeat`, 'num', 1, 99, 'Повторить блок', 'раз'))}
            ${b.steps.map((st, si) => `<div class="step">
              <div class="step-top"><button class="kind-btn" data-act="kind" data-b="${bi}" data-s="${si}"><span class="dot" style="background:var(--${st.kind});margin:0"></span>${KINDS[st.kind]}</button>
                <input type="text" data-bind="${bp}.steps.${si}.name" value="${esc(st.name)}" aria-label="Название шага" placeholder="Название"></div>
              ${stepper('D', `${bp}.steps.${si}.dur`, 'dur', 0, DMAX, st.name || 'Длительность')}
              <button class="icon-btn" data-act="stepMenu" data-b="${bi}" data-s="${si}" aria-label="Действия с шагом">${I('more')}</button>
            </div>`).join('')}
            <button class="add-line" data-act="addStep" data-b="${bi}">${I('plus')} Добавить шаг</button>
          </section>`;
        });
        h += `<button class="add-block" data-act="addBlock">${I('plus')} Добавить блок</button>`;
        break;
    }
    if (d.type !== 'stopwatch') {
      const useDef = d.pre === null || d.pre === undefined;
      h += `<div class="group-title">Сигналы</div><div class="group">
        ${row(`Предсигнал как в настройках`, switchHTML('D', 'preDefault', useDef), `Сейчас: ${S.preSignal ? `за ${S.preSignal} с до конца фазы` : 'выключен'}`)}
        ${useDef ? '' : row('Предсигнал за', stepper('D', 'pre', 'num', 0, 60, 'Предсигнал, секунд', 'с'), '0 — выключен')}
      </div>`;
    }
    return h;
  }
  function summaryHTML() {
    const d = state.draft, c = compile(d);
    if (c.mode === 'sw') return `<div class="summary"><div class="meta">Секундомер считает вверх, без ограничения</div></div>`;
    return `<div class="summary"><div class="meta">Общее время · ${c.segs.length} ${plural(c.segs.length, 'фаза', 'фазы', 'фаз')}</div><div class="big">${fmt(c.total)}</div>${stripHTML(c)}</div>`;
  }
  function renderEdit() {
    const d = state.draft;
    app.innerHTML = `<div class="screen">
      <header class="topbar"><button class="icon-btn" data-act="back" aria-label="Назад">${I('back')}</button>
        <h1>${state.isNew ? 'Новый: ' + esc(TYPES[d.type].name) : 'Изменить'}</h1>
        ${state.isNew ? '' : `<button class="icon-btn" data-act="delDraft" aria-label="Удалить" style="color:var(--danger)">${I('trash')}</button>`}</header>
      <main class="form">
        <input class="text-input" type="text" data-bind="name" value="${esc(d.name)}" placeholder="Название" aria-label="Название таймера" maxlength="60">
        ${editFields()}
        <div id="sum">${summaryHTML()}</div>
      </main>
      <div class="bottom-bar"><button class="btn" data-act="runDraft">${I('play')} Старт</button><button class="btn primary" data-act="save">${I('check')} Сохранить</button></div>
    </div>`;
  }
  function updSummary() { const el = $('#sum'); if (el) el.innerHTML = summaryHTML(); }

  // ---------- Настройки ----------
  function renderSettings() {
    const segBtns = (key, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button class="${S[key] == v ? 'on' : ''}" data-act="setOpt" data-k="${key}" data-v="${v}">${l}</button>`).join('')}</div>`;
    const sw = (label, key, hint) => row(label, switchHTML('S', key, S[key]), hint);
    const wlOk = 'wakeLock' in navigator;
    app.innerHTML = `<div class="screen">
      <header class="topbar"><button class="icon-btn" data-act="back" aria-label="Назад">${I('back')}</button><h1>Настройки</h1></header>
      <main class="form">
        <div class="group-title">Предварительный сигнал</div>
        <div class="group">
          ${row('Сигнал за', stepper('S', 'preSignal', 'num', 0, 60, 'Предсигнал, секунд', 'с'), 'До окончания фазы · 0 — выключен')}
          ${sw('Перед концом работы', 'preWork', 'Работа, разминка, заминка')}
          ${sw('Перед концом отдыха', 'preRest', 'Отдых и подготовка')}
          ${sw('Сигнал на середине работы', 'halfway', 'Для фаз от 30 секунд')}
        </div>
        <p style="margin:0 8px;color:var(--muted);font-size:.95rem">Короткий сигнал — предупреждение. Длинный — смена фазы. В конце тренировки длинный звучит дважды. В каждом шаблоне предсигнал можно задать свой.</p>
        <div class="group-title">Звук и вибрация</div>
        <div class="group">
          ${sw('Звук', 'sound')}
          <div class="row row-col"><div class="lbl">Громкость сигнала</div><input class="range" type="range" min="0.1" max="1" step="0.05" value="${S.volume}" data-range="volume" aria-label="Громкость"></div>
          <div class="row"><div class="lbl">Проверить</div><div class="seg" style="flex:none"><button data-act="test" data-v="short">Короткий</button><button data-act="test" data-v="long">Длинный</button></div></div>
          ${sw('Вибрация', 'vibrate')}
          ${sw('Вспышка экрана при сигнале', 'flash')}
        </div>
        <div class="group-title">Экран</div>
        <div class="group">
          <div class="row row-col"><div class="lbl">Тема</div>${segBtns('theme', [['auto', 'Как в системе'], ['light', 'Светлая'], ['dark', 'Тёмная']])}</div>
          <div class="row row-col"><div class="lbl">Размер текста</div>${segBtns('textScale', [[1, 'Обычный'], [1.15, 'Крупный'], [1.3, 'Очень крупный']])}</div>
          ${sw('Цветной фон фазы', 'phaseBg', 'Весь экран окрашивается: работа, отдых… Видно издалека')}
          <div class="row row-col"><div class="lbl">Не гасить экран<small>${wlOk ? 'Поддерживается этим браузером' : 'Этот браузер не умеет удерживать экран. Откройте в Chrome'}</small></div>${segBtns('keepAwake', [['always', 'Всё время в приложении'], ['run', 'Только на тренировке']])}</div>
          ${sw('Спрашивать перед остановкой', 'confirmStop', 'Защита от случайного нажатия')}
        </div>
        <div class="group-title">Данные</div>
        <div class="group">
          <button class="btn-line" data-act="exportAll">${I('download')}<span>Сохранить копию в файл<small>Все таймеры и настройки · в «Загрузки»</small></span></button>
          <button class="btn-line" data-act="shareAll">${I('share')}<span>Отправить копию<small>Например, на Яндекс Диск или в мессенджер</small></span></button>
          <button class="btn-line" data-act="import">${I('upload')}<span>Загрузить из файла<small>Восстановить копию или добавить таймеры</small></span></button>
          <button class="btn-line" data-act="restorePresets">${I('restore')}<span>Вернуть стандартные шаблоны<small>Добавит недостающие, ваши не тронет</small></span></button>
        </div>
        <p style="margin:6px 8px;color:var(--muted);font-size:.9rem">Спорт-таймер ${APP_VERSION}. Все данные хранятся только на этом телефоне.</p>
      </main>
    </div>`;
  }

  // ---------- Тренировка ----------
  function renderRun() {
    if (!RUN) return;
    const t = RUN.t, c = RUN.c;
    const cls = `run${S.phaseBg ? ' phase-bg' : ''}${!RUN.running && !RUN.done ? ' paused' : ''}`;
    const top = `<div class="run-top"><button class="icon-btn" data-act="stop" aria-label="Завершить">${I('close')}</button>
      <div class="run-title">${esc(t.name)}</div><div class="awake" id="awake"></div></div>`;
    let main, controls, kind;

    if (RUN.done) {
      kind = 'done';
      main = `<div class="done-box"><div class="big">Готово!</div><div class="meta">Время: ${fmt(c.total)}</div>
        ${t.type === 'amrap' ? `<div class="meta">Кругов: <b style="color:var(--text)">${RUN.amrap}</b></div>` : ''}</div>`;
      controls = `<button class="ctl" data-act="again" aria-label="Ещё раз">${I('reset')}</button>
        <button class="ctl main" data-act="exitRun" aria-label="Закрыть">${I('check')}</button>`;
    } else if (c.mode === 'sw') {
      kind = 'work';
      const laps = RUN.laps.map((l, i) => `<div><span>Круг ${i + 1}</span><span>${fmt(Math.floor(l.lap / 1000))}.${Math.floor((l.lap % 1000) / 100)}</span><span>${fmt(Math.floor(l.total / 1000))}</span></div>`).reverse().join('');
      main = `<div class="ph-label">${RUN.running ? 'Секундомер' : RUN.base ? 'Пауза' : 'Секундомер'}</div>
        <div class="ph-sub">${t.p.beepEvery > 0 ? `Сигнал каждые ${fmt(t.p.beepEvery)}` : ''}</div>
        <div class="digits" id="dig"></div>
        <div class="laps">${laps}</div>`;
      controls = `<button class="ctl" data-act="swReset" aria-label="Сброс" ${RUN.running ? 'disabled' : ''}>${I('reset')}</button>
        <button class="ctl main" data-act="toggle" aria-label="${RUN.running ? 'Пауза' : 'Старт'}">${I(RUN.running ? 'pause' : 'play')}</button>
        <button class="ctl" data-act="lap" aria-label="Круг" ${RUN.running ? '' : 'disabled'}>${I('flag')}</button>`;
    } else {
      const i = RUN.seg >= 0 ? RUN.seg : segAt(elapsed());
      RUN.seg = i;
      const s = c.segs[i], nx = c.segs[i + 1];
      kind = s.kind;
      main = `<div class="ph-label">${esc(s.label)}</div>
        <div class="ph-sub">${esc(s.info)}</div>
        <div class="digits" id="dig"></div>
        <div class="bar"><i id="bar"></i></div>
        ${t.type === 'amrap' && s.kind === 'work' ? `<div class="amrap"><button data-act="amrapMinus" aria-label="Минус круг">−1</button><button class="plus" data-act="amrapPlus">+1 круг · ${RUN.amrap}</button></div>` : ''}
        <div class="next">${nx ? `<span class="dot" style="background:var(--${nx.kind})"></span>Далее: ${esc(nx.label)} <b>${fmt(nx.dur)}</b>` : `${I('flag')} Далее: финиш`}</div>
        <div class="run-foot" id="foot"></div>`;
      controls = `<button class="ctl" data-act="prev" aria-label="Предыдущая фаза">${I('prev')}</button>
        <button class="ctl main" data-act="toggle" aria-label="${RUN.running ? 'Пауза' : 'Продолжить'}">${I(RUN.running ? 'pause' : 'play')}</button>
        <button class="ctl" data-act="next" aria-label="Следующая фаза">${I('next')}</button>`;
    }
    app.innerHTML = `<div class="${cls}" data-kind="${kind}">${top}<main class="run-main">${main}</main><div class="controls">${controls}</div></div>`;
    RUN.lastDig = '';
    updAwake();
    if (!RUN.done) paint(elapsed());
  }

  /* ================= Действия ================= */
  function askStop() {
    if (!S.confirmStop || !RUN || RUN.done || (!RUN.running && RUN.base === 0)) { exitRun(); return; }
    const wasRunning = RUN.running;
    confirmBox('Завершить тренировку?', wasRunning ? 'Таймер продолжает идти, пока вы решаете.' : '', 'Завершить', exitRun, true);
  }
  function exitRun() { if (RUN) { cancelAnimationFrame(RUN.raf); Snd.cancel(); RUN = null; } leave(); }
  function askDiscard() { confirmBox('Выйти без сохранения?', 'Изменения будут потеряны.', 'Выйти', () => { state.dirty = false; leave(); }, true); }

  function openEditor(t, isNew) { state.draft = clone(t); state.isNew = isNew; state.dirty = false; go('edit'); }
  function saveDraft() {
    const d = state.draft;
    d.name = (d.name || '').trim() || TYPES[d.type].name;
    d.updated = Date.now();
    const i = T.findIndex((x) => x.id === d.id);
    if (i >= 0) T[i] = clone(d); else T.unshift(clone(d));
    saveT();
    state.dirty = false;
  }

  function templateMenu(id) {
    const t = T.find((x) => x.id === id);
    if (!t) return;
    sheet(t.name, [
      { icon: 'edit', label: 'Изменить', act: () => openEditor(t, false) },
      { icon: 'copy', label: 'Дублировать', act: () => { const c = clone(t); c.id = uid(); c.name = t.name + ' (копия)'; c.created = c.updated = Date.now(); T.splice(T.indexOf(t) + 1, 0, c); saveT(); render(); toast('Копия создана'); } },
      { icon: 'top', label: 'Переместить наверх', act: () => { T.splice(T.indexOf(t), 1); T.unshift(t); saveT(); render(); } },
      { icon: 'share', label: 'Отправить этот таймер', hint: 'Файлом — можно открыть на другом телефоне', act: () => shareFile([t], false) },
      { icon: 'trash', label: 'Удалить', danger: true, act: () => confirmBox('Удалить таймер?', `«${t.name}» будет удалён.`, 'Удалить', () => { T = T.filter((x) => x.id !== id); saveT(); render(); toast('Удалено'); }, true) }
    ]);
  }
  function newMenu() {
    const tiles = Object.entries(TYPES).map(([k, v]) => `<button class="type-tile" data-act="pick" data-t="${k}">${I(k)}<b>${v.name}</b><span>${v.desc}</span></button>`).join('');
    openLayer(`<div class="backdrop" data-act="close"><div class="sheet" role="dialog" aria-label="Новый таймер"><div class="grab"></div><h2>Новый таймер</h2><div class="type-grid">${tiles}</div></div></div>`, {
      pick: (el) => { const t = el.dataset.t; closeLayer().then(() => openEditor(newTemplate(t), true)); }
    });
  }

  // ---------- Экспорт / импорт ----------
  function backupData(templates, withSettings) {
    const d = { app: 'sport-timer', format: 1, version: APP_VERSION, exportedAt: new Date().toISOString(), templates };
    if (withSettings) d.settings = S;
    return JSON.stringify(d, null, 2);
  }
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const safeName = (s) => s.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '-').slice(0, 40) || 'timer';
  function downloadFile(json, name) {
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Файл сохранён в «Загрузки»');
  }
  async function shareFile(templates, all) {
    const json = backupData(templates, all);
    const name = all ? `sport-timer-${today()}.json` : `timer-${safeName(templates[0].name)}.json`;
    const variants = [new File([json], name, { type: 'application/json' }), new File([json], name, { type: 'text/plain' })];
    if (navigator.canShare) {
      for (const f of variants) {
        if (navigator.canShare({ files: [f] })) {
          try { await navigator.share({ files: [f], title: name }); return; }
          catch (e) { if (e.name === 'AbortError') return; }
        }
      }
    }
    downloadFile(json, name);
  }
  function normalizeTemplate(x) {
    if (!x || typeof x !== 'object' || !TYPES[x.type] || typeof x.p !== 'object') return null;
    const base = newTemplate(x.type);
    const t = Object.assign(base, x, { p: Object.assign(defaultsFor(x.type), x.p) });
    if (typeof t.id !== 'string' || !/^[a-z0-9_-]{1,40}$/i.test(t.id)) t.id = uid();
    for (const k of ['created', 'updated', 'lastUsed']) if (k in t && typeof t[k] !== 'number') delete t[k];
    t.name = String(t.name || TYPES[t.type].name).slice(0, 60);
    t.pre = (t.pre === null || t.pre === undefined || t.pre === '') ? null : clamp(parseInt(t.pre, 10) || 0, 0, 60);
    if (t.type === 'custom') {
      t.p = { prep: clamp(parseInt(t.p.prep, 10) || 0, 0, DMAX), blocks: t.p.blocks };
      if (!Array.isArray(t.p.blocks) || !t.p.blocks.length) t.p.blocks = defaultsFor('custom').blocks;
      t.p.blocks = t.p.blocks.filter((b) => b && typeof b === 'object').map((b) => ({ name: String(b.name || 'Блок').slice(0, 60), repeat: clamp(parseInt(b.repeat, 10) || 1, 1, 99),
        steps: (Array.isArray(b.steps) ? b.steps : []).filter((s) => s && typeof s === 'object').map((s) => ({ name: String(s.name || '').slice(0, 60), kind: KINDS[s.kind] ? s.kind : 'work', dur: clamp(parseInt(s.dur, 10) || 0, 0, DMAX) })) }));
    } else {
      const def = defaultsFor(t.type), q = {};
      for (const k of Object.keys(def)) q[k] = clamp(parseInt(t.p[k], 10) || 0, 0, DMAX);
      if ('rounds' in q) q.rounds = clamp(q.rounds, 1, 999);
      if ('sets' in q) q.sets = clamp(q.sets, 1, 99);
      for (const k of ['work', 'interval', 'duration']) if (k in q) q[k] = Math.max(1, q[k]);
      t.p = q;
    }
    return t;
  }
  function normalizeSettings(x) {
    const out = Object.assign({}, DEFAULT_SETTINGS);
    if (x && typeof x === 'object') for (const k of Object.keys(DEFAULT_SETTINGS)) if (typeof x[k] === typeof DEFAULT_SETTINGS[k]) out[k] = x[k];
    out.preSignal = clamp(Math.round(out.preSignal) || 0, 0, 60);
    out.volume = clamp(+out.volume || 1, 0.1, 1);
    if (!['auto', 'light', 'dark'].includes(out.theme)) out.theme = 'auto';
    if (![1, 1.15, 1.3].includes(out.textScale)) out.textScale = 1;
    if (!['always', 'run'].includes(out.keepAwake)) out.keepAwake = 'always';
    return out;
  }
  function importFile(file) {
    const rd = new FileReader();
    rd.onload = () => {
      let data;
      try { data = JSON.parse(rd.result); } catch (e) { toast('Файл не читается — это не копия таймера'); return; }
      let list = Array.isArray(data) ? data : Array.isArray(data.templates) ? data.templates : data.type ? [data] : [];
      const seen = new Set();
      list = list.map(normalizeTemplate).filter(Boolean).map((t) => { if (seen.has(t.id)) t.id = uid(); seen.add(t.id); return t; });
      const hasSettings = !!(data && data.settings && typeof data.settings === 'object' && !Array.isArray(data.settings));
      if (!list.length && !hasSettings) { toast('В файле нет таймеров'); return; }
      const n = list.length;
      const acts = {
        merge: () => closeLayer().then(() => {
          let add = 0, upd = 0;
          list.forEach((t) => { const i = T.findIndex((x) => x.id === t.id); if (i >= 0) { T[i] = t; upd++; } else { T.push(t); add++; } });
          saveT(); render(); toast(`Добавлено: ${add}${upd ? `, обновлено: ${upd}` : ''}`);
        }),
        replace: () => closeLayer().then(() => {
          confirmBox('Заменить всё?', 'Текущие таймеры будут заменены таймерами из файла.', 'Заменить', () => {
            if (n) T = list;
            if (hasSettings) S = normalizeSettings(data.settings);
            saveT(); saveS(); Snd.setVol(S.volume); render(); toast('Копия восстановлена');
          }, true);
        })
      };
      openLayer(`<div class="backdrop center" data-act="close"><div class="dialog"><h2>Загрузка из файла</h2>
        <p>В файле: ${n} ${plural(n, 'таймер', 'таймера', 'таймеров')}${hasSettings ? ' и настройки' : ''}.</p>
        <div class="actions">${n ? `<button class="btn primary" data-act="merge">Добавить к моим</button>` : ''}
          <button class="btn" data-act="replace">Заменить всё${hasSettings ? ' (с настройками)' : ''}</button>
          <button class="btn" data-act="close">Отмена</button></div></div></div>`, acts);
    };
    rd.readAsText(file);
  }
  $('#fileIn').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) importFile(f); e.target.value = ''; });

  // ---------- Конструктор ----------
  function kindMenu(bi, si) {
    const st = state.draft.p.blocks[bi].steps[si];
    sheet('Тип шага', Object.entries(KINDS).map(([k, l]) => ({ label: l + (k === st.kind ? '  ✓' : ''), act: () => {
      if (!st.name || st.name === KINDS[st.kind]) st.name = l;
      st.kind = k; state.dirty = true; renderEdit();
    } })));
  }
  function stepMenu(bi, si) {
    const b = state.draft.p.blocks[bi], st = b.steps[si];
    const mv = (d) => { const j = si + d; if (j < 0 || j >= b.steps.length) return; [b.steps[si], b.steps[j]] = [b.steps[j], b.steps[si]]; state.dirty = true; renderEdit(); };
    sheet(st.name || 'Шаг', [
      { icon: 'up', label: 'Выше', act: () => mv(-1) },
      { icon: 'down', label: 'Ниже', act: () => mv(1) },
      { icon: 'copy', label: 'Дублировать', act: () => { b.steps.splice(si + 1, 0, clone(st)); state.dirty = true; renderEdit(); } },
      { icon: 'trash', label: 'Удалить шаг', danger: true, act: () => { b.steps.splice(si, 1); state.dirty = true; renderEdit(); } }
    ]);
  }
  function blockMenu(bi) {
    const bl = state.draft.p.blocks, b = bl[bi];
    const mv = (d) => { const j = bi + d; if (j < 0 || j >= bl.length) return; [bl[bi], bl[j]] = [bl[j], bl[bi]]; state.dirty = true; renderEdit(); };
    sheet(b.name || 'Блок', [
      { icon: 'up', label: 'Блок выше', act: () => mv(-1) },
      { icon: 'down', label: 'Блок ниже', act: () => mv(1) },
      { icon: 'copy', label: 'Дублировать блок', act: () => { const c = clone(b); c.name = b.name + ' (копия)'; bl.splice(bi + 1, 0, c); state.dirty = true; renderEdit(); } },
      { icon: 'trash', label: 'Удалить блок', danger: true, act: () => { if (bl.length === 1) { toast('Нужен хотя бы один блок'); return; } bl.splice(bi, 1); state.dirty = true; renderEdit(); } }
    ]);
  }

  // ---------- Степперы (нажатие и удержание) ----------
  function stepOnce(stepEl, dir) {
    const { root, path, kind } = stepEl.dataset;
    const min = +stepEl.dataset.min, max = +stepEl.dataset.max;
    const r = rootOf(root);
    const v = +getPath(r, path) || 0;
    const nv = clamp(kind === 'dur' ? durStep(v, dir) : v + dir, min, max);
    if (nv === v) return;
    setPath(r, path, nv);
    stepEl.querySelector('.val').textContent = fmtVal(kind, nv, stepEl.dataset.unit);
    afterValue(root);
  }
  function afterValue(root) {
    if (root === 'S') { saveS(); }
    else { state.dirty = true; updSummary(); }
  }
  let holdT = 0, holdI = 0, holdBtn = null, held = false;
  const stopHold = () => { clearTimeout(holdT); clearInterval(holdI); holdT = holdI = 0; holdBtn = null; };
  document.addEventListener('pointerdown', (e) => {
    Snd.init();
    const b = e.target.closest('.pm');
    if (!b) return;
    stopHold();
    holdBtn = b; held = false;
    const st = b.closest('.stepper'), dir = b.dataset.act === 'inc' ? 1 : -1;
    holdT = setTimeout(() => { held = true; stepOnce(st, dir); holdI = setInterval(() => stepOnce(st, dir), 110); }, 450);
  });
  document.addEventListener('pointerup', (e) => {
    const b = holdBtn;
    if (b && !held && e.target.closest('.pm') === b) stepOnce(b.closest('.stepper'), b.dataset.act === 'inc' ? 1 : -1);
    stopHold();
  }, true);
  document.addEventListener('pointercancel', stopHold, true);
  window.addEventListener('scroll', () => { if (holdBtn && !held) stopHold(); }, { passive: true });
  document.addEventListener('contextmenu', (e) => { if (e.target.closest('.pm')) e.preventDefault(); });

  // ---------- Поля ввода ----------
  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.bind && state.draft) {
      setPath(state.draft, el.dataset.bind, el.value);
      state.dirty = true;
      if (state.draft.type === 'custom') updSummary();
    } else if (el.dataset.range === 'volume') {
      S.volume = +el.value; Snd.setVol(S.volume); saveS();
    }
  });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (!el.dataset.switch) return;
    const [root, key] = el.dataset.switch.split(':');
    if (root === 'S') { S[key] = el.checked; saveS(); if (key === 'sound' && el.checked) Snd.unlock(); }
    else if (key === 'preDefault') { state.draft.pre = el.checked ? null : S.preSignal; state.dirty = true; renderEdit(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && layer.firstChild && layerActs.ok && e.target.tagName === 'INPUT') { e.preventDefault(); layerActs.ok(); }
  });

  // ---------- Нажатия ----------
  const ACT = {
    settings: () => go('settings'),
    new: newMenu,
    start: (el) => { const t = T.find((x) => x.id === el.dataset.id); if (t) startRun(t); },
    menu: (el) => templateMenu(el.dataset.id),
    back: () => history.back(),
    save: () => { saveDraft(); toast('Сохранено'); leave(); },
    runDraft: () => { if (state.dirty && !state.isNew) { /* запускаем как есть, без сохранения */ } startRun(state.draft); },
    delDraft: () => confirmBox('Удалить таймер?', `«${state.draft.name}» будет удалён.`, 'Удалить', () => { T = T.filter((x) => x.id !== state.draft.id); saveT(); state.dirty = false; leave(); toast('Удалено'); }, true),
    input: (el) => {
      const st = el.closest('.stepper'), { root, path, kind, title, unit } = st.dataset;
      const r = rootOf(root), v = +getPath(r, path) || 0, min = +st.dataset.min, max = +st.dataset.max;
      const done = (nv) => { setPath(r, path, clamp(nv, min, max)); afterValue(root); render(); };
      if (kind === 'dur') askDuration(title, v, max, done);
      else askNumber(title + (unit ? `, ${unit}` : ''), v, min, max, done);
    },
    addStep: (el) => { const b = state.draft.p.blocks[+el.dataset.b]; const last = b.steps[b.steps.length - 1]; b.steps.push(last && last.kind === 'work' ? { name: 'Отдых', kind: 'rest', dur: 20 } : { name: 'Работа', kind: 'work', dur: 40 }); state.dirty = true; renderEdit(); },
    addBlock: () => { const bl = state.draft.p.blocks; bl.push({ name: `Блок ${bl.length + 1}`, repeat: 1, steps: [{ name: 'Работа', kind: 'work', dur: 40 }] }); state.dirty = true; renderEdit(); },
    kind: (el) => kindMenu(+el.dataset.b, +el.dataset.s),
    stepMenu: (el) => stepMenu(+el.dataset.b, +el.dataset.s),
    blockMenu: (el) => blockMenu(+el.dataset.b),
    setOpt: (el) => { const k = el.dataset.k; S[k] = k === 'textScale' ? +el.dataset.v : el.dataset.v; saveS(); render(); if (k === 'keepAwake') wake(); },
    test: (el) => { Snd.unlock().then(() => Snd.play(el.dataset.v)); if (S.vibrate && navigator.vibrate) navigator.vibrate(el.dataset.v === 'short' ? 150 : 500); },
    exportAll: () => downloadFile(backupData(T, true), `sport-timer-${today()}.json`),
    shareAll: () => shareFile(T, true),
    import: () => $('#fileIn').click(),
    restorePresets: () => { const names = new Set(T.map((t) => t.name)); const add = presets().filter((p) => !names.has(p.name)); T.push(...add); saveT(); toast(add.length ? `Добавлено шаблонов: ${add.length}` : 'Все стандартные шаблоны уже есть'); },
    // тренировка
    stop: askStop,
    exitRun: exitRun,
    toggle: () => { if (!RUN) return; RUN.running ? pause() : resume(); },
    prev: () => { const e = elapsed(), s = RUN.c.segs[segAt(e)], i = RUN.c.segs.indexOf(s); seek(e / 1000 - s.start > 2 || i === 0 ? s.start * 1000 : RUN.c.segs[i - 1].start * 1000); },
    next: () => { const e = elapsed(), i = segAt(e), nx = RUN.c.segs[i + 1]; if (nx) seek(nx.start * 1000); else confirmBox('Завершить тренировку?', '', 'Завершить', () => seek(RUN.c.total * 1000)); },
    again: () => { const t = RUN.t; RUN = null; startRunInPlace(t); },
    amrapPlus: (el) => { RUN.amrap++; RUN.amrapSplits.push(elapsed()); el.textContent = `+1 круг · ${RUN.amrap}`; if (S.vibrate && navigator.vibrate) navigator.vibrate(60); },
    amrapMinus: () => { if (RUN.amrap > 0) { RUN.amrap--; RUN.amrapSplits.pop(); const b = $('.amrap .plus'); if (b) b.textContent = `+1 круг · ${RUN.amrap}`; } },
    lap: () => { const e = elapsed(), prev = RUN.laps.length ? RUN.laps[RUN.laps.length - 1].total : 0; RUN.laps.push({ total: e, lap: e - prev }); renderRun(); if (S.vibrate && navigator.vibrate) navigator.vibrate(60); },
    swReset: () => { RUN.base = 0; RUN.laps = []; RUN.nextBeep = 0; renderRun(); }
  };
  function startRunInPlace(t) {
    // повтор той же тренировки без нового шага в истории
    const c = compile(t);
    RUN = { t, c, events: c.mode === 'seq' ? buildEvents(c, t) : [], base: 0, resumeAt: 0, running: false, done: false,
      evIdx: 0, schedIdx: 0, sCtx: 0, sEl: 0, seg: -1, amrap: 0, amrapSplits: [], laps: [], nextBeep: 0, raf: 0, lastDig: '' };
    renderRun();
    resume();
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    if ((act === 'inc' || act === 'dec')) {
      if (e.detail === 0) stepOnce(el.closest('.stepper'), act === 'inc' ? 1 : -1); // клавиатура
      return;
    }
    if (layer.contains(el)) {
      if (act === 'close') { if (el.classList.contains('backdrop') && e.target !== el) return; closeLayer(); return; }
      if (layerActs[act]) { layerActs[act](el, e); return; }
    }
    if (ACT[act]) ACT[act](el, e);
  });

  /* ================= Запуск ================= */
  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.theme === 'auto') { const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(); } });
  render();
  wake();
  document.addEventListener('pointerdown', () => { if (!wl) wake(); }, { passive: true });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      const ask = (w) => toast('Есть новая версия — нажмите, чтобы обновить', 12000, () => w.postMessage('skipWaiting'));
      if (reg.waiting && navigator.serviceWorker.controller) ask(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) ask(w); });
      });
    }).catch(() => {});
    let reloaded = false;
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloaded && !RUN) { reloaded = true; location.reload(); } });
  }

  // для проверки
  window.__timer = { compile, buildEvents, get RUN() { return RUN; }, S, get T() { return T; } };
})();
