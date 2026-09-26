// Marathon Web Audio SFX Synthesizer
// Generates tactical futuristic micro-audio directly in the browser via Web Audio API

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('iitd_sfx_muted') === 'true';
    this.lastScrollClickTime = 0;
    this.lastClickSoundTime = 0;
    this.wheelAccumulator = 0;
    this.lastWheelTime = 0;
    this.scrollListenerAttached = false;
    this.clickListenerAttached = false;

    this.initUserGestureUnlock();
    this.initScrollListener();
    this.initGlobalClickListener();
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      // Use lowest latency hint for instantaneous audio-visual synchronization
      this.ctx = new AudioCtx({ latencyHint: 'interactive' });
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
    // Pre-warm AudioContext on earliest possible interaction so first scroll has zero latency
    ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'].forEach(evt => {
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
    if (now - this.lastScrollClickTime < 24) return;
    this.lastScrollClickTime = now;

    const t = this.ctx.currentTime;
    const isDown = direction >= 0;

    // Organic micro-pitch variance (±40Hz) so continuous scrolling sounds like physical gear teeth
    const jitter = (Math.random() - 0.5) * 80;
    // Directional pitch modulation: scrolling down has a solid tactical click, scrolling up is crisper/higher
    const baseFreq = isDown ? (1750 + jitter) : (2150 + jitter);
    const endFreq = isDown ? 420 : 650;
    const duration = 0.014;

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
    thump.frequency.exponentialRampToValueAtTime(50, t + 0.010);

    thumpGain.gain.setValueAtTime(0.02, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.010);

    thump.connect(thumpGain);
    thumpGain.connect(this.ctx.destination);

    thump.start(t);
    thump.stop(t + 0.010);
  }

  // Evaluates instantly whether the element under cursor or window can scroll in the requested direction
  canScroll(target, deltaY = 0, deltaX = 0) {
    const isVertical = Math.abs(deltaY) >= Math.abs(deltaX);

    // 1. Check if the element under cursor or any parent container is scrollable
    let el = target instanceof Element ? target : null;
    while (el && el !== document.body && el !== document.documentElement) {
      const style = window.getComputedStyle(el);
      const ovY = style.overflowY;
      const ovX = style.overflowX;

      if (isVertical && (ovY === 'auto' || ovY === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
        if (deltaY > 0 && el.scrollTop < el.scrollHeight - el.clientHeight - 1) {
          return true; // Can scroll down inside this container
        }
        if (deltaY < 0 && el.scrollTop > 1) {
          return true; // Can scroll up inside this container
        }
      }

      if (!isVertical && (ovX === 'auto' || ovX === 'scroll') && el.scrollWidth > el.clientWidth + 1) {
        if (deltaX > 0 && el.scrollLeft < el.scrollWidth - el.clientWidth - 1) {
          return true;
        }
        if (deltaX < 0 && el.scrollLeft > 1) {
          return true;
        }
      }

      el = el.parentElement;
    }

    // 2. Check window / document scrolling
    const docEl = document.scrollingElement || document.documentElement;
    if (!docEl) return false;

    const maxScrollY = Math.max(0, docEl.scrollHeight - window.innerHeight);
    const maxScrollX = Math.max(0, docEl.scrollWidth - window.innerWidth);
    const curY = window.scrollY || docEl.scrollTop || 0;
    const curX = window.scrollX || docEl.scrollLeft || 0;

    if (isVertical) {
      if (maxScrollY <= 1) return false; // Entire document fits in viewport, cannot scroll
      if (deltaY > 0) {
        return curY < maxScrollY - 1; // Can scroll down
      } else {
        return curY > 1; // Can scroll up
      }
    } else {
      if (maxScrollX <= 1) return false;
      if (deltaX > 0) {
        return curX < maxScrollX - 1;
      } else {
        return curX > 1;
      }
    }
  }

  // Instantaneous hardware-synchronized scrolling detection
  initScrollListener() {
    if (typeof window === 'undefined' || this.scrollListenerAttached) return;
    this.scrollListenerAttached = true;

    // 1. Mouse wheel and trackpad (Hardware interrupt event: ZERO LATENCY)
    window.addEventListener('wheel', (e) => {
      if (this.muted) return;

      const dy = e.deltaY;
      const dx = e.deltaX;
      const primaryDelta = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
      if (primaryDelta === 0) return;

      // FIRST: Check if the page or container CAN ACTUALLY SCROLL in this direction
      if (!this.canScroll(e.target, dy, dx)) {
        this.wheelAccumulator = 0;
        return; // Page is at top/bottom or cannot move -> ZERO SOUND
      }

      this.lastWheelTime = performance.now();
      const direction = primaryDelta > 0 ? 1 : -1;

      // Discrete mouse wheel notch (standard wheels)
      if (e.deltaMode !== 0 || Math.abs(primaryDelta) >= 45) {
        this.playScrollClick(direction);
        this.wheelAccumulator = 0;
      } else {
        // Continuous precision trackpad: accumulate small delta values
        this.wheelAccumulator += primaryDelta;
        const threshold = 22; // Low threshold for immediate tactile response without lag
        if (Math.abs(this.wheelAccumulator) >= threshold) {
          this.playScrollClick(direction);
          this.wheelAccumulator = this.wheelAccumulator > 0
            ? Math.max(0, this.wheelAccumulator - threshold)
            : Math.min(0, this.wheelAccumulator + threshold);
        }
      }
    }, { passive: true });

    // 2. Scrollbar dragging and keyboard navigation (when mouse wheel is not active)
    let lastScrollY = window.scrollY || (document.scrollingElement && document.scrollingElement.scrollTop) || 0;

    window.addEventListener('scroll', (e) => {
      if (this.muted) return;
      const now = performance.now();

      // If wheel event already handled this motion, skip to avoid double triggering
      if (now - this.lastWheelTime < 100) {
        lastScrollY = window.scrollY || (document.scrollingElement && document.scrollingElement.scrollTop) || 0;
        return;
      }

      const docEl = document.scrollingElement || document.documentElement;
      const maxScrollY = docEl ? Math.max(0, docEl.scrollHeight - window.innerHeight) : 0;
      const curY = window.scrollY || (docEl && docEl.scrollTop) || 0;
      const clampedY = Math.min(maxScrollY, Math.max(0, curY));

      const diff = clampedY - lastScrollY;
      lastScrollY = clampedY;

      if (Math.abs(diff) >= 20) {
        this.playScrollClick(diff > 0 ? 1 : -1);
      }
    }, { passive: true, capture: true });
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
