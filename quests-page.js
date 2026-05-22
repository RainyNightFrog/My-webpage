/**
 * Special quests — Rainy Night Frog
 */
(function (global) {
  var DAILY_GOAL = 10;

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

  function hoursUntilReset() {
    var now = new Date();
    var end = new Date(now);
    end.setHours(24, 0, 0, 0);
    var diff = end - now;
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));
  }

  function renderStatsBar(stats) {
    var bar =
      global.LCApp && LCApp.renderLearnStatsBar
        ? LCApp.renderLearnStatsBar(stats)
        : '<div class="lc-learn-stats"></div>';
    return bar.replace(
      'class="lc-learn-stats"',
      'class="lc-learn-stats lc-quests-top-stats"'
    );
  }

  function questCard(opts) {
    var cur = Math.min(opts.current, opts.goal);
    var pct = opts.goal ? Math.min(100, Math.round((cur / opts.goal) * 100)) : 0;
    var done = cur >= opts.goal;
    var locked = opts.locked;

    if (locked) {
      return (
        '<div class="lc-quest-card locked">' +
        '<span class="lc-quest-icon" aria-hidden="true">🔒</span>' +
        '<p class="lc-quest-label">' +
        t("flow.questMoreLocked") +
        "</p></div>"
      );
    }

    return (
      '<div class="lc-quest-card' +
      (done ? " done" : "") +
      '">' +
      '<span class="lc-quest-bolt" aria-hidden="true">⚡</span>' +
      '<div class="lc-quest-body">' +
      '<p class="lc-quest-label">' +
      t("flow.dailyXpTask", { n: opts.goal }) +
      "</p>" +
      '<div class="lc-quest-bar-wrap">' +
      '<div class="lc-quest-bar">' +
      '<div class="lc-quest-fill" style="width:' +
      pct +
      '%"></div>' +
      '<span class="lc-quest-num">' +
      cur +
      " / " +
      opts.goal +
      "</span></div>" +
      '<span class="lc-quest-chest' +
      (done ? " done" : "") +
      '" aria-hidden="true"></span>' +
      "</div></div></div>"
    );
  }

  function renderMain(stats) {
    var hours = hoursUntilReset();
    var xp = stats.dailyXp || 0;

    return (
      '<div class="lc-quests-hero">' +
      '<div class="lc-quests-hero-text">' +
      "<h1>" +
      t("flow.questHeroTitle") +
      "</h1>" +
      "<p>" +
      t("flow.questHeroDesc") +
      "</p></div>" +
      '<div class="lc-quests-hero-art" aria-hidden="true">' +
      '<div class="lc-quests-hero-lift">' +
      '<div class="lc-quests-hero-chest"></div>' +
      '<div class="lc-quests-frog" data-frog-logo></div>' +
      "</div></div></div>" +
      '<section class="lc-quests-daily">' +
      '<div class="lc-quests-daily-head">' +
      "<h2>" +
      t("flow.learnDailyTitle") +
      "</h2>" +
      '<span class="lc-quests-timer">' +
      '<span class="lc-quests-timer-icon" aria-hidden="true"></span>' +
      t("flow.questHoursLeft", { n: hours }) +
      "</span></div>" +
      questCard({ current: xp, goal: DAILY_GOAL, locked: false }) +
      questCard({ locked: true }) +
      "</section>"
    );
  }

  function renderAside() {
    return (
      '<div class="lc-quests-monthly">' +
      '<div class="lc-quests-monthly-medal" aria-hidden="true">' +
      '<span class="lc-quests-monthly-coin"></span>' +
      '<span class="lc-quests-monthly-bolt">⚡</span></div>' +
      "<h2>" +
      t("flow.questMonthlyTitle") +
      "</h2>" +
      "<p>" +
      t("flow.questMonthlyDesc") +
      "</p>" +
      '<a class="lc-quests-monthly-cta" href="learn.html">' +
      t("flow.leaderboardGoLearn") +
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

  function init() {
    var stats = global.LCApp
      ? LCApp.getLearnStats()
      : { streak: 1, gems: 0, hearts: 5, dailyXp: 0, target: "en" };

    var main = document.getElementById("questsMain");
    var side = document.getElementById("questsSide");
    if (main) main.innerHTML = renderMain(stats);
    if (side) {
      side.innerHTML = renderStatsBar(stats) + renderAside();
    }

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    var langLbl = document.querySelector("[data-learn-lang-label]");
    if (langLbl && global.LCApp) {
      langLbl.textContent =
        (LANG_FLAGS[stats.target] || "") +
        " " +
        t(
          stats.target === "zh"
            ? "flow.courseZh"
            : COURSE_KEYS[stats.target] || "flow.courseEn"
        );
    }
    if (global.LCApp && LCApp.initCoursePicker) LCApp.initCoursePicker();
    if (global.LCApp && LCApp.initStreakPicker) LCApp.initStreakPicker();
    if (global.LCApp && LCApp.initGemsPicker) LCApp.initGemsPicker();
    if (global.LCApp && LCApp.initHeartsPicker) LCApp.initHeartsPicker();
  }

  global.RNFQuests = { init: init };
})(typeof window !== "undefined" ? window : this);
