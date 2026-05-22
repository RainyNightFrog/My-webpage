/**
 * Leaderboard (locked) — Rainy Night Frog
 */
(function (global) {
  var UNLOCK_UNITS = 10;

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

  function getUnitsCompleted() {
    try {
      return parseInt(localStorage.getItem("rnf_units_done") || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function skeletonRows(count) {
    var html = "";
    var widths = [72, 55, 88, 40, 65, 78, 50];
    for (var i = 0; i < count; i++) {
      html +=
        '<div class="lc-lb-skel-row">' +
        '<span class="lc-lb-skel-rank"></span>' +
        '<span class="lc-lb-skel-avatar"></span>' +
        '<span class="lc-lb-skel-bar" style="width:' +
        (widths[i % widths.length] || 60) +
        '%"></span></div>';
    }
    return html;
  }

  function renderLocked(remaining) {
    return (
      '<div class="lc-lb-locked">' +
      '<div class="lc-lb-shields" aria-hidden="true">' +
      '<span class="lc-lb-shield bronze">🛡️</span>' +
      '<span class="lc-lb-shield gold">🛡️<span class="lc-lb-feather">🪶</span></span>' +
      '<span class="lc-lb-shield silver">🛡️</span>' +
      '<span class="lc-lb-spark s1"></span><span class="lc-lb-spark s2"></span>' +
      '<span class="lc-lb-spark s3"></span></div>' +
      "<h1>" +
      t("flow.learnBoardTitle") +
      "</h1>" +
      "<p class=\"lc-lb-sub\">" +
      t("flow.learnBoardDesc", { n: remaining }) +
      "</p>" +
      '<a class="lc-lb-cta" href="learn.html">' +
      t("flow.leaderboardGoLearn") +
      "</a>" +
      '<div class="lc-lb-skeleton" aria-hidden="true">' +
      skeletonRows(7) +
      "</div></div>"
    );
  }

  function renderTipCard() {
    return (
      '<div class="lc-lb-tip-card">' +
      '<div class="lc-lb-tip-mascot" aria-hidden="true">' +
      '<span class="lc-lb-headband">🎽</span>' +
      '<div class="lc-lb-frog" data-frog-logo></div>' +
      '<span class="lc-lb-dumbbell">🏋️</span></div>' +
      "<h2>" +
      t("flow.leaderboardHowTitle") +
      "</h2>" +
      '<p class="lc-lb-tip-tagline">' +
      t("flow.leaderboardHowTagline") +
      "</p>" +
      '<p class="lc-lb-tip-desc">' +
      t("flow.leaderboardHowDesc") +
      "</p></div>"
    );
  }

  function init() {
    var done = getUnitsCompleted();
    var remaining = Math.max(0, UNLOCK_UNITS - done);
    var main = document.getElementById("leaderboardMain");
    var aside = document.getElementById("leaderboardAside");

    if (main) {
      if (remaining <= 0) {
        main.innerHTML =
          '<div class="lc-lb-unlocked">' +
          "<h1>" +
          t("flow.leaderboardUnlockedTitle") +
          "</h1>" +
          "<p>" +
          t("flow.leaderboardUnlockedDesc") +
          "</p>" +
          '<a class="lc-btn-primary" href="learn.html">' +
          t("flow.leaderboardGoLearn") +
          "</a></div>";
      } else {
        main.innerHTML = renderLocked(remaining);
      }
    }

    if (aside) aside.innerHTML = renderTipCard();

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    var langLbl = document.querySelector("[data-learn-lang-label]");
    if (langLbl && global.LCApp) {
      var target = LCApp.getLearnTarget();
      langLbl.textContent =
        (LANG_FLAGS[target] || "") +
        " " +
        t(COURSE_KEYS[target] || "flow.courseEn");
    }
  }

  global.RNFLeaderboard = { init: init, UNLOCK_UNITS: UNLOCK_UNITS };
})(typeof window !== "undefined" ? window : this);
