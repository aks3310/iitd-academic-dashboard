// Marathon Web Audio SFX Synthesizer
// Generates tactical futuristic micro-audio directly in the browser via Web Audio API

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('iitd_sfx_muted') === 'true';
    this.lastScrollClickTime = 0;
    this.lastClickSoundTime = 0;
    this.windowScrollAccumulator = 0;
    this.windowScrollTimer = null;
    this.lastClampedWindowY = 0;
    this.lastClampedWindowX = 0;
    this.scrollListenerAttached = false;
    this.clickListenerAttached = false;

    this.initUserGestureUnlock();
    this.initScrollListener();
    this.initGlobalClickListener();
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  initUserGestureUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    };
    // Unlocks browser AudioContext on first user interaction gesture
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, unlock, { passive: true, once: true });
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('iitd_sfx_muted', this.muted);
    if (!this.muted) {
      this.playBeep(880, 0.05, 'sine');
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playClick() {
    if (this.muted) return;
    this.lastClickSoundTime = performance.now();
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  // Tactical clicking scrolling sound (mechanical ratchet / rotary encoder click)
  playScrollClick(direction = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const now = performance.now();
    // Throttle to ensure clean click separation without audio buffer overload on rapid motion
    if (now - this.lastScrollClickTime < 28) return;
    this.lastScrollClickTime = now;

    const t = this.ctx.currentTime;
    const isDown = direction >= 0;

    // Organic micro-pitch variance (±40Hz) so continuous scrolling sounds like physical gear teeth
    const jitter = (Math.random() - 0.5) * 80;
    // Directional pitch modulation: scrolling down has a solid tactical click, scrolling up is crisper/higher
    const baseFreq = isDown ? (1750 + jitter) : (2150 + jitter);
    const endFreq = isDown ? 420 : 650;
    const duration = 0.015;

    // 1. High transient mechanical ratchet snap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);

    // Subtle tactile gain envelope
    gain.gain.setValueAtTime(0.035, t);
    gain.gain.exponentialRampToValueAtTime(0.0008, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);

    // 2. Subtle low-end mechanical body thump (160Hz -> 50Hz) simulating gear tooth weight
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();

    thump.type = 'sine';
    thump.frequency.setValueAtTime(160, t);
    thump.frequency.exponentialRampToValueAtTime(50, t + 0.011);

    thumpGain.gain.setValueAtTime(0.02, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.011);

    thump.connect(thumpGain);
    thumpGain.connect(this.ctx.destination);

    thump.start(t);
    thump.stop(t + 0.011);
  }

  // Motion-grounded scrolling detection: plays ONLY when the page or element ACTUALLY moves
  initScrollListener() {
    if (typeof window === 'undefined' || this.scrollListenerAttached) return;
    this.scrollListenerAttached = true;

    const updateInitialPositions = () => {
      const el = document.scrollingElement || document.documentElement;
      if (!el) return;
      const maxY = Math.max(0, el.scrollHeight - window.innerHeight);
      const maxX = Math.max(0, el.scrollWidth - window.innerWidth);
      this.lastClampedWindowY = Math.min(maxY, Math.max(0, window.scrollY || el.scrollTop || 0));
      this.lastClampedWindowX = Math.min(maxX, Math.max(0, window.scrollX || el.scrollLeft || 0));
    };

    updateInitialPositions();

    // Actual movement-based scroll handler (triggered ONLY when content actually moves)
    const handleScroll = (e) => {
      if (this.muted) return;

      const target = e.target;
      let primaryDiff = 0;

      // Case A: Window / Document scrolling
      if (target === document || target === window || target === document.documentElement || target === document.body || !target) {
        const el = document.scrollingElement || document.documentElement;
        if (!el) return;

        const maxScrollY = Math.max(0, el.scrollHeight - window.innerHeight);
        const maxScrollX = Math.max(0, el.scrollWidth - window.innerWidth);

        // If page has no scrollable range at all, do nothing
        if (maxScrollY <= 0 && maxScrollX <= 0) return;

        const rawY = window.scrollY || el.scrollTop || 0;
        const rawX = window.scrollX || el.scrollLeft || 0;

        // Clamp to physical bounds [0, maxScroll] to eliminate rubber-banding/overscroll noise at edges
        const clampedY = Math.min(maxScrollY, Math.max(0, rawY));
        const clampedX = Math.min(maxScrollX, Math.max(0, rawX));

        const diffY = clampedY - this.lastClampedWindowY;
        const diffX = clampedX - this.lastClampedWindowX;

        this.lastClampedWindowY = clampedY;
        this.lastClampedWindowX = clampedX;

        // If clamped delta is 0 (i.e. user is at top scrolling up, or at bottom scrolling down), DO NOT PLAY SOUND
        if (diffY === 0 && diffX === 0) return;

        primaryDiff = Math.abs(diffY) >= Math.abs(diffX) ? diffY : diffX;

        // Reset accumulator on direction change
        if ((primaryDiff > 0 && this.windowScrollAccumulator < 0) || (primaryDiff < 0 && this.windowScrollAccumulator > 0)) {
          this.windowScrollAccumulator = 0;
        }

        this.windowScrollAccumulator += primaryDiff;
        const threshold = 28; // px of actual movement per click

        if (Math.abs(this.windowScrollAccumulator) >= threshold) {
          const direction = this.windowScrollAccumulator > 0 ? 1 : -1;
          this.playScrollClick(direction);
          this.windowScrollAccumulator = 0;
        }

        clearTimeout(this.windowScrollTimer);
        this.windowScrollTimer = setTimeout(() => {
          this.windowScrollAccumulator = 0;
        }, 150);

      } else if (target instanceof HTMLElement) {
        // Case B: Scrollable inner containers (e.g. modals, lists)
        const maxScrollY = Math.max(0, target.scrollHeight - target.clientHeight);
        const maxScrollX = Math.max(0, target.scrollWidth - target.clientWidth);

        if (maxScrollY <= 0 && maxScrollX <= 0) return;

        const clampedY = Math.min(maxScrollY, Math.max(0, target.scrollTop));
        const clampedX = Math.min(maxScrollX, Math.max(0, target.scrollLeft));

        const lastY = target._lastClampedY !== undefined ? target._lastClampedY : clampedY;
        const lastX = target._lastClampedX !== undefined ? target._lastClampedX : clampedX;

        const diffY = clampedY - lastY;
        const diffX = clampedX - lastX;

        target._lastClampedY = clampedY;
        target._lastClampedX = clampedX;

        // If clamped delta is 0, container has reached the boundary and is not moving
        if (diffY === 0 && diffX === 0) return;

        primaryDiff = Math.abs(diffY) >= Math.abs(diffX) ? diffY : diffX;

        target._scrollAccumulator = target._scrollAccumulator || 0;
        if ((primaryDiff > 0 && target._scrollAccumulator < 0) || (primaryDiff < 0 && target._scrollAccumulator > 0)) {
          target._scrollAccumulator = 0;
        }

        target._scrollAccumulator += primaryDiff;
        const threshold = 28;

        if (Math.abs(target._scrollAccumulator) >= threshold) {
          const direction = target._scrollAccumulator > 0 ? 1 : -1;
          this.playScrollClick(direction);
          target._scrollAccumulator = 0;
        }

        clearTimeout(target._scrollTimer);
        target._scrollTimer = setTimeout(() => {
          target._scrollAccumulator = 0;
        }, 150);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', updateInitialPositions, { passive: true });
  }

  // Delegated click listener ensures every button/link/interactive control clicks crisply
  initGlobalClickListener() {
    if (typeof window === 'undefined' || this.clickListenerAttached) return;
    this.clickListenerAttached = true;

    document.addEventListener('click', (e) => {
      if (this.muted) return;
      const clickable = e.target.closest('button, a[href], input[type="button"], input[type="submit"], input[type="reset"], input[type="checkbox"], input[type="radio"], [role="button"], .course-tab, .preset-target-btn, .preset-pill-btn, .tactical-btn, .modal-close-btn');
      if (clickable) {
        const now = performance.now();
        // If an explicit sound was already triggered within the last 45ms, prevent double-click sound
        if (now - this.lastClickSoundTime < 45) return;
        this.lastClickSoundTime = now;
        this.playClick();
      }
    }, { passive: true });
  }

  playInputTick() {
    if (this.muted) return;
    this.lastClickSoundTime = performance.now();
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.02);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.02);
  }

  playSuccess() {
    if (this.muted) return;
    this.lastClickSoundTime = performance.now();
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

    const now = this.ctx.currentTime;
    [440, 660, 880].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.06, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.12);
    });
  }

  playWarning() {
    if (this.muted) return;
    this.lastClickSoundTime = performance.now();
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

    const now = this.ctx.currentTime;
    [320, 280].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0.05, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.09);
    });
  }

  playBeep(freq = 900, duration = 0.06, type = 'sine') {
    if (this.muted) return;
    this.lastClickSoundTime = performance.now();
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
  }
}

window.sfx = new SoundFX();
