/**
 * Settings page UI
 */
(function (global) {
  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function fontOptions() {
    return [
      { id: "outfit", key: "flow.settingsFontOutfit", sampleKey: "flow.settingsFontSample" },
      { id: "clear", key: "flow.settingsFontClear", sampleKey: "flow.settingsFontSample" },
      { id: "fredoka", key: "flow.settingsFontFredoka", sampleKey: "flow.settingsFontSample" },
      { id: "large", key: "flow.settingsFontLarge", sampleKey: "flow.settingsFontSample" },
    ];
  }

  function renderFontChoices(current) {
    var html = "";
    fontOptions().forEach(function (opt) {
      var checked = current === opt.id ? " checked" : "";
      html +=
        '<label class="lc-settings-font-opt">' +
        '<input type="radio" name="rnfFont" value="' +
        opt.id +
        '"' +
        checked +
        " />" +
        '<span class="lc-settings-font-card lc-settings-font-card--' +
        opt.id +
        '">' +
        '<span class="lc-settings-font-name">' +
        t(opt.key) +
        "</span>" +
        '<span class="lc-settings-font-sample" data-font-sample="' +
        opt.id +
        '">' +
        t(opt.sampleKey) +
        "</span></span></label>";
    });
    return '<div class="lc-settings-font-grid">' + html + "</div>";
  }

  function renderUiLangChoices() {
    if (!global.LCApp || !LCApp.UI_LANG_OPTIONS) return "";
    var cur = global.AppI18n ? AppI18n.getLang() : "zhHant";
    var html = "";
    LCApp.UI_LANG_OPTIONS.forEach(function (item) {
      if (!item.app) return;
      var active = item.app === cur ? " lc-settings-lang-btn--active" : "";
      html +=
        '<button type="button" class="lc-settings-lang-btn' +
        active +
        '" data-ui-lang="' +
        item.code +
        '">' +
        '<span class="lc-settings-lang-flag">' +
        item.flag +
        "</span>" +
        "<span>" +
        item.native +
        "</span></button>";
    });
    return '<div class="lc-settings-lang-grid">' + html + "</div>";
  }

  function render() {
    var root = document.getElementById("settingsMain");
    if (!root || !global.RNFSettings) return;

    var s = RNFSettings.loadSettings();
    root.innerHTML =
      '<header class="lc-settings-head">' +
      '<a class="lc-settings-back" href="learn.html">← ' +
      t("flow.settingsBack") +
      "</a>" +
      '<h1 class="lc-settings-title">' +
      t("flow.settingsTitle") +
      "</h1>" +
      '<p class="lc-settings-sub">' +
      t("flow.settingsSub") +
      "</p></header>" +
      '<section class="lc-settings-section">' +
      '<h2 class="lc-settings-section-title">🔊 ' +
      t("flow.settingsSoundTitle") +
      "</h2>" +
      '<p class="lc-settings-section-desc">' +
      t("flow.settingsSoundDesc") +
      "</p>" +
      '<label class="lc-settings-toggle">' +
      '<input type="checkbox" id="settingsSoundOn"' +
      (s.soundEnabled ? " checked" : "") +
      " />" +
      '<span class="lc-settings-toggle-ui"></span>' +
      '<span class="lc-settings-toggle-lbl">' +
      t("flow.settingsSoundOn") +
      "</span></label>" +
      '<div class="lc-settings-slider-row' +
      (s.soundEnabled ? "" : " lc-settings-slider-row--off") +
      '" id="volumeRow">' +
      '<label for="settingsVolume">' +
      t("flow.settingsVolume") +
      "</label>" +
      '<input type="range" id="settingsVolume" min="0" max="100" step="5" value="' +
      s.volume +
      '" />' +
      '<output id="settingsVolumeOut" for="settingsVolume">' +
      s.volume +
      "%</output>" +
      '<button type="button" class="lc-settings-test-sound" id="settingsTestSound">' +
      t("flow.settingsTestSound") +
      "</button></div></section>" +
      '<section class="lc-settings-section">' +
      '<h2 class="lc-settings-section-title">🔤 ' +
      t("flow.settingsFontTitle") +
      "</h2>" +
      '<p class="lc-settings-section-desc">' +
      t("flow.settingsFontDesc") +
      "</p>" +
      renderFontChoices(s.font) +
      "</section>" +
      '<section class="lc-settings-section">' +
      '<h2 class="lc-settings-section-title">🌐 ' +
      t("flow.settingsUiLangTitle") +
      "</h2>" +
      '<p class="lc-settings-section-desc">' +
      t("flow.settingsUiLangDesc") +
      "</p>" +
      renderUiLangChoices() +
      "</section>" +
      '<section class="lc-settings-section">' +
      '<h2 class="lc-settings-section-title">✨ ' +
      t("flow.settingsEffectsTitle") +
      "</h2>" +
      '<label class="lc-settings-toggle">' +
      '<input type="checkbox" id="settingsEffectsOn"' +
      (s.effectsEnabled ? " checked" : "") +
      " />" +
      '<span class="lc-settings-toggle-ui"></span>' +
      '<span class="lc-settings-toggle-lbl">' +
      t("flow.settingsEffectsOn") +
      "</span></label></section>" +
      '<div class="lc-settings-actions">' +
      '<button type="button" class="lc-btn-ghost" id="settingsReset">' +
      t("flow.settingsReset") +
      "</button></div>";

    bindEvents();
    applyFontSamples();
  }

  function applyFontSamples() {
    if (!global.RNFSettings) return;
    document.querySelectorAll("[data-font-sample]").forEach(function (el) {
      var id = el.getAttribute("data-font-sample");
      var preset = RNFSettings.FONT_PRESETS[id];
      if (preset) el.style.fontFamily = preset.font;
    });
  }

  function bindEvents() {
    var soundOn = document.getElementById("settingsSoundOn");
    var volume = document.getElementById("settingsVolume");
    var volumeOut = document.getElementById("settingsVolumeOut");
    var volumeRow = document.getElementById("volumeRow");
    var testBtn = document.getElementById("settingsTestSound");
    var effectsOn = document.getElementById("settingsEffectsOn");
    var resetBtn = document.getElementById("settingsReset");

    function syncVolumeRow() {
      if (!volumeRow || !soundOn) return;
      volumeRow.classList.toggle("lc-settings-slider-row--off", !soundOn.checked);
    }

    if (soundOn) {
      soundOn.addEventListener("change", function () {
        RNFSettings.saveSettings({ soundEnabled: soundOn.checked });
        syncVolumeRow();
      });
    }

    if (volume && volumeOut) {
      volume.addEventListener("input", function () {
        volumeOut.textContent = volume.value + "%";
        RNFSettings.saveSettings({ volume: parseInt(volume.value, 10) });
      });
    }

    if (testBtn) {
      testBtn.addEventListener("click", function () {
        if (!global.LCApp || !LCApp.speakText) return;
        LCApp.speakText(t("flow.settingsTestSoundPhrase"), { lang: "zh-HK" });
      });
    }

    if (effectsOn) {
      effectsOn.addEventListener("change", function () {
        RNFSettings.saveSettings({ effectsEnabled: effectsOn.checked });
      });
    }

    document.querySelectorAll('input[name="rnfFont"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (radio.checked) {
          RNFSettings.saveSettings({ font: radio.value });
          applyFontSamples();
        }
      });
    });

    document.querySelectorAll("[data-ui-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.getAttribute("data-ui-lang");
        if (global.LCApp && LCApp.applyUiLangChoice) {
          LCApp.applyUiLangChoice(code);
          document.dispatchEvent(new CustomEvent("lc:langchange"));
        }
        document.querySelectorAll("[data-ui-lang]").forEach(function (b) {
          b.classList.toggle(
            "lc-settings-lang-btn--active",
            b.getAttribute("data-ui-lang") === code
          );
        });
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (confirm(t("flow.settingsResetConfirm"))) {
          RNFSettings.resetSettings();
          render();
        }
      });
    }
  }

  function init() {
    render();
    document.addEventListener("lc:langchange", render);
    document.addEventListener("rnf:settings-change", render);
  }

  global.RNFSettingsPage = { init: init, render: render };
})(typeof window !== "undefined" ? window : this);
