/**
 * Gem shop — Rainy Night Frog
 */
(function (global) {
  var MAX_HEARTS = 5;
  var REFILL_COST = 350;
  var STREAK_FREEZE_EQUIPPED = 2;
  var STREAK_FREEZE_MAX = 2;

  var COURSE_KEYS = {
    en: "flow.courseEn",
    es: "flow.courseEs",
    fr: "flow.courseFr",
    ja: "flow.courseJa",
    zh: "flow.courseZh",
    de: "flow.courseDe",
    ko: "flow.courseKo",
    it: "flow.courseIt",
    pt: "flow.coursePt",
  };

  var LANG_FLAGS = {
    en: "🇺🇸",
    es: "🇪🇸",
    fr: "🇫🇷",
    ja: "🇯🇵",
    zh: "🇨🇳",
    de: "🇩🇪",
    ko: "🇰🇷",
    it: "🇮🇹",
    pt: "🇧🇷",
  };

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function getUnitsRemaining() {
    if (!global.LCApp) return 9;
    var done = LCApp.getUnitsCompleted ? LCApp.getUnitsCompleted() : 0;
    var need = global.RNFLeaderboard ? RNFLeaderboard.UNLOCK_UNITS : 10;
    return Math.max(0, need - done);
  }

  function renderStats(stats) {
    var bar =
      global.LCApp && LCApp.renderLearnStatsBar
        ? LCApp.renderLearnStatsBar(stats)
        : '<div class="lc-learn-stats"></div>';
    return bar.replace(
      'class="lc-learn-stats"',
      'class="lc-learn-stats lc-shop-top-stats"'
    );
  }

  function renderFamilyBanner() {
    return (
      '<div class="lc-shop-family-banner">' +
      '<div class="lc-shop-family-chars" aria-hidden="true">' +
      '<span>🐸</span><span>👧</span><span>👦</span><span>🧒</span>' +
      "</div>" +
      '<div class="lc-shop-family-text">' +
      "<h1>" +
      t("flow.shopFamilyTitle") +
      "</h1>" +
      "<p>" +
      t("flow.shopFamilyDesc") +
      "</p>" +
      '<a href="super.html" class="lc-shop-family-cta">' +
      t("flow.shopFamilyCta") +
      "</a></div></div>"
    );
  }

  function shopRow(opts) {
    var btnClass = "lc-shop-btn";
    if (opts.disabled) btnClass += " disabled";
    if (opts.accent) btnClass += " accent";

    var status = "";
    if (opts.statusKey) {
      status =
        '<span class="lc-shop-row-status">' +
        t(opts.statusKey, opts.statusVars) +
        "</span>";
    }

    var iconClass = "lc-shop-row-icon";
    if (opts.iconClass) iconClass += " " + opts.iconClass;

    var btnTag = opts.href ? "a" : "button";
    var btnAttrs =
      btnTag === "a"
        ? ' href="' + opts.href + '" class="' + btnClass + '"'
        : ' type="button" class="' +
          btnClass +
          '"' +
          (opts.disabled ? " disabled" : "") +
          ' data-action="' +
          (opts.action || "") +
          '"';

    return (
      '<article class="lc-shop-row">' +
      '<span class="' +
      iconClass +
      '" aria-hidden="true">' +
      opts.icon +
      "</span>" +
      '<div class="lc-shop-row-body">' +
      '<div class="lc-shop-row-title">' +
      "<h3>" +
      t(opts.titleKey) +
      "</h3>" +
      status +
      "</div>" +
      "<p>" +
      t(opts.descKey) +
      "</p></div>" +
      "<" +
      btnTag +
      btnAttrs +
      ">" +
      t(opts.btnKey, opts.btnVars) +
      "</" +
      btnTag +
      "></article>"
    );
  }

  function renderMain(stats) {
    var heartsFull = stats.hearts >= MAX_HEARTS;
    var canRefill = !heartsFull && stats.gems >= REFILL_COST;

    return (
      renderFamilyBanner() +
      '<section class="lc-shop-section">' +
      "<h2>" +
      t("flow.shopHeartsTitle") +
      "</h2>" +
      shopRow({
        icon: "❤️",
        titleKey: "flow.shopRefillTitle",
        descKey: "flow.shopRefillDesc",
        btnKey: heartsFull ? "flow.shopHeartsFull" : "flow.shopRefillBtn",
        btnVars: heartsFull ? null : { n: REFILL_COST },
        disabled: heartsFull || !canRefill,
        action: canRefill ? "refill" : "",
      }) +
      shopRow({
        icon: "♾️",
        iconClass: "infinity",
        titleKey: "flow.shopUnlimitedTitle",
        descKey: "flow.shopUnlimitedDesc",
        btnKey: "flow.shopFreeTrial",
        accent: true,
        href: "super.html",
      }) +
      "</section>" +
      '<section class="lc-shop-section">' +
      "<h2>" +
      t("flow.shopItemsTitle") +
      "</h2>" +
      shopRow({
        icon: "🧊",
        titleKey: "flow.shopFreezeTitle",
        descKey: "flow.shopFreezeDesc",
        statusKey: "flow.shopFreezeEquipped",
        statusVars: { n: STREAK_FREEZE_EQUIPPED, max: STREAK_FREEZE_MAX },
        btnKey: "flow.shopEquipped",
        disabled: true,
      }) +
      "</section>"
    );
  }

  function renderSidebar(stats) {
    var dailyPct = stats.dailyGoal
      ? Math.min(100, Math.round((stats.dailyXp / stats.dailyGoal) * 100))
      : 0;
    var dailyCur = Math.min(stats.dailyXp, stats.dailyGoal);
    var dailyDone = dailyCur >= stats.dailyGoal;
    var boardLeft = getUnitsRemaining();

    return (
      renderStats(stats) +
      '<div class="lc-panel-card lc-shop-board-card">' +
      "<h3 class=\"lc-panel-title\">" +
      t("flow.learnBoardTitle") +
      "</h3>" +
      '<div class="lc-shop-board-row">' +
      '<span class="lc-shop-board-shield" aria-hidden="true">🛡️</span>' +
      '<p class="lc-panel-text">' +
      t("flow.learnBoardDesc", { n: boardLeft }) +
      "</p></div></div>" +
      '<div class="lc-panel-card lc-panel-daily">' +
      '<div class="lc-panel-head-row">' +
      "<h3 class=\"lc-panel-title\">" +
      t("flow.learnDailyTitle") +
      "</h3>" +
      '<a href="quests.html" class="lc-panel-link">' +
      t("flow.learnShowAll") +
      "</a></div>" +
      '<p class="lc-panel-quest-lbl">' +
      t("flow.dailyXpTask", { n: stats.dailyGoal }) +
      "</p>" +
      '<div class="lc-panel-quest-bar' +
      (dailyDone ? " done" : "") +
      '">' +
      '<div class="lc-panel-quest-fill" style="width:' +
      dailyPct +
      '%"></div>' +
      '<span class="lc-panel-quest-num">' +
      dailyCur +
      " / " +
      stats.dailyGoal +
      "</span>" +
      (dailyDone
        ? '<span class="lc-panel-quest-chest" aria-hidden="true">🎁</span>'
        : "") +
      "</div></div>" +
      '<div class="lc-shop-ad-slot">' +
      '<a href="super.html" class="lc-shop-remove-ads">' +
      t("flow.shopRemoveAds") +
      "</a></div>" +
      '<nav class="lc-panel-footer lc-shop-footer">' +
      '<a href="home.html">' +
      t("flow.learnFooterAbout") +
      "</a>" +
      '<a href="shop.html">' +
      t("flow.navShop") +
      "</a>" +
      '<a href="home.html">' +
      t("flow.shopFooterEfficacy") +
      "</a>" +
      '<a href="home.html">' +
      t("flow.shopFooterCareers") +
      "</a>" +
      '<a href="home.html">' +
      t("flow.shopFooterInvestors") +
      "</a>" +
      '<a href="home.html">' +
      t("flow.profileFooterTerms") +
      "</a>" +
      '<a href="home.html">' +
      t("flow.privacyPolicy") +
      "</a></nav>"
    );
  }

  function bindActions(stats) {
    document.querySelectorAll(".lc-shop-btn[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-action");
        if (!action || btn.disabled) return;

        if (action === "refill" && stats.hearts < MAX_HEARTS) {
          if (global.LCApp && LCApp.refillHeartsFromGems) {
            LCApp.refillHeartsFromGems();
          } else if (stats.gems >= REFILL_COST) {
            try {
              var target = LCApp.getLearnTarget();
              localStorage.setItem(
                "rnf_gems_" + target,
                String(stats.gems - REFILL_COST)
              );
              localStorage.setItem("rnf_hearts_" + target, String(MAX_HEARTS));
            } catch (e) {}
            document.dispatchEvent(new CustomEvent("lc:heartschange"));
          }
          init();
        }
      });
    });
  }

  function init() {
    var stats = global.LCApp
      ? LCApp.getLearnStats()
      : {
          streak: 1,
          gems: 505,
          hearts: 5,
          dailyXp: 10,
          dailyGoal: 10,
          target: "en",
        };

    var main = document.getElementById("shopMain");
    var side = document.getElementById("shopSide");
    if (main) main.innerHTML = renderMain(stats);
    if (side) side.innerHTML = renderSidebar(stats);

    if (global.RNFFrogLogo) RNFFrogLogo.mount();
    bindActions(stats);
    if (global.LCApp && LCApp.initCoursePicker) LCApp.initCoursePicker();
    if (global.LCApp && LCApp.initStreakPicker) LCApp.initStreakPicker();
    if (global.LCApp && LCApp.initGemsPicker) LCApp.initGemsPicker();
    if (global.LCApp && LCApp.initHeartsPicker) LCApp.initHeartsPicker();

    var langLbl = document.querySelector("[data-learn-lang-label]");
    if (langLbl) {
      langLbl.textContent =
        (LANG_FLAGS[stats.target] || "") +
        " " +
        t(
          stats.target === "zh"
            ? "flow.courseZh"
            : COURSE_KEYS[stats.target] || "flow.courseEn"
        );
    }
  }

  global.RNFShop = { init: init, REFILL_COST: REFILL_COST };
})(typeof window !== "undefined" ? window : this);
