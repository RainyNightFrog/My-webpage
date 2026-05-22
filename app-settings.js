/**
 * User settings — sound volume, font, effects (localStorage)
 */
(function (global) {
  var STORAGE_KEY = "rnf_user_settings";

  /** scale = 全站根字級倍率（rem 文字會跟著變大）；large 只放大、不改字體風格 */
  var FONT_PRESETS = {
    outfit: {
      font: '"Outfit", "Microsoft JhengHei", "PingFang TC", sans-serif',
      display: '"Syne", "Outfit", "Microsoft JhengHei", sans-serif',
      brand: '"Fredoka", "Outfit", "Microsoft JhengHei", sans-serif',
      scale: 1,
    },
    clear: {
      font: '"Segoe UI", "Microsoft JhengHei", "PingFang TC", "Helvetica Neue", sans-serif',
      display: '"Segoe UI", "Microsoft JhengHei", sans-serif',
      brand: '"Segoe UI", "Microsoft JhengHei", sans-serif',
      scale: 1,
    },
    fredoka: {
      font: '"Fredoka", "Microsoft JhengHei", sans-serif',
      display: '"Fredoka", "Microsoft JhengHei", sans-serif',
      brand: '"Fredoka", "Microsoft JhengHei", sans-serif',
      scale: 1,
    },
    large: {
      font: '"Outfit", "Microsoft JhengHei", "PingFang TC", sans-serif',
      display: '"Syne", "Outfit", "Microsoft JhengHei", sans-serif',
      brand: '"Fredoka", "Outfit", "Microsoft JhengHei", sans-serif',
      scale: 1.32,
    },
  };

  function defaultSettings() {
    return {
      soundEnabled: true,
      volume: 85,
      font: "outfit",
      effectsEnabled: true,
    };
  }

  function loadSettings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return Object.assign(defaultSettings(), JSON.parse(raw));
      }
    } catch (e) {}
    return defaultSettings();
  }

  function saveSettings(next) {
    var merged = Object.assign(loadSettings(), next || {});
    if (merged.volume != null) {
      merged.volume = Math.max(0, Math.min(100, Math.round(merged.volume)));
    }
    if (!FONT_PRESETS[merged.font]) merged.font = "outfit";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {}
    applySettings(merged);
    try {
      if (global.document && document.dispatchEvent) {
        document.dispatchEvent(new CustomEvent("rnf:settings-change", { detail: merged }));
      }
    } catch (e2) {}
    return merged;
  }

  function getVolume() {
    var v = loadSettings().volume;
    return Math.max(0, Math.min(1, v / 100));
  }

  function isSoundEnabled() {
    return !!loadSettings().soundEnabled;
  }

  function isEffectsEnabled() {
    return !!loadSettings().effectsEnabled;
  }

  function applySettings(settings) {
    settings = settings || loadSettings();
    var preset = FONT_PRESETS[settings.font] || FONT_PRESETS.outfit;
    var root = document.documentElement;
    var scale = preset.scale != null ? preset.scale : 1;
    root.style.setProperty("--font", preset.font);
    root.style.setProperty("--font-display", preset.display);
    root.style.setProperty("--font-brand", preset.brand);
    root.style.setProperty("--rnf-text-scale", String(scale));
    root.style.fontSize = Math.round(16 * scale) + "px";
    root.dataset.rnfFont = settings.font;
    root.dataset.rnfTextScale = String(scale);
    root.dataset.rnfSound = settings.soundEnabled ? "on" : "off";
    root.dataset.rnfEffects = settings.effectsEnabled ? "on" : "off";
    if (!settings.effectsEnabled) {
      root.classList.add("lc-reduce-motion");
    } else {
      root.classList.remove("lc-reduce-motion");
    }
  }

  function resetSettings() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    return saveSettings(defaultSettings());
  }

  global.RNFSettings = {
    STORAGE_KEY: STORAGE_KEY,
    FONT_PRESETS: FONT_PRESETS,
    defaultSettings: defaultSettings,
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    resetSettings: resetSettings,
    applySettings: applySettings,
    getVolume: getVolume,
    isSoundEnabled: isSoundEnabled,
    isEffectsEnabled: isEffectsEnabled,
  };

  applySettings();
})(typeof window !== "undefined" ? window : this);
