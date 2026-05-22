/**
 * Special quests — daily quest board.
 */
(function (global) {
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

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  function questCard(q) {
    var pct = q.goal ? Math.min(100, Math.round((q.progress / q.goal) * 100)) : 0;
    var done = q.done;
    var claimed = q.claimed;

    var actions = "";
    if (q.id === "checkin" && !done && !claimed) {
      actions =
        '<button type="button" class="lc-quest-checkin-btn" data-quest-checkin>📅 ' +
        escapeHtml(t("flow.questCheckinBtn")) +
        "</button>";
    } else if (q.canClaim) {
      actions =
        '<button type="button" class="lc-quest-claim-btn" data-quest-claim="' +
        q.id +
        '">' +
        escapeHtml(t("flow.questClaim")) +
        " +" +
        q.reward +
        " 💎</button>";
    } else if (claimed) {
      actions =
        '<span class="lc-quest-claimed-badge">✓ ' +
        escapeHtml(t("flow.questClaimed")) +
        "</span>";
    }

    return (
      '<div class="lc-quest-card' +
      (done ? " done" : "") +
      (claimed ? " claimed" : "") +
      '" data-quest-id="' +
      q.id +
      '">' +
      '<span class="lc-quest-bolt" aria-hidden="true">' +
      q.icon +
      "</span>" +
      '<div class="lc-quest-body">' +
      '<div class="lc-quest-head-row">' +
      '<p class="lc-quest-label">' +
      escapeHtml(t(q.titleKey, { n: q.goal })) +
      "</p>" +
      '<span class="lc-quest-reward-pill">+' +
      q.reward +
      " 💎</span></div>" +
      '<p class="lc-quest-desc">' +
      escapeHtml(t(q.descKey)) +
      "</p>" +
      '<div class="lc-quest-bar-wrap">' +
      '<div class="lc-quest-bar">' +
      '<div class="lc-quest-fill' +
      (done ? " lc-quest-fill--done" : "") +
      '" style="width:' +
      pct +
      '%"></div>' +
      '<span class="lc-quest-num">' +
      q.progress +
      " / " +
      q.goal +
      "</span></div>" +
      '<span class="lc-quest-chest' +
      (done ? " done" : "") +
      '" aria-hidden="true"></span>' +
      "</div>" +
      actions +
      "</div></div>"
    );
  }

  function renderMain() {
    var api = global.RNFQuestSystem;
    if (!api) {
      return '<p class="lc-quest-error">' + escapeHtml(t("flow.questLoadError")) + "</p>";
    }
    var summary = api.getSummary();
    var hours = summary.hoursLeft;
    var allDone = summary.done >= summary.total;
    var cards = "";
    summary.quests.forEach(function (q) {
      cards += questCard(q);
    });

    return (
      '<div class="lc-quests-hero">' +
      '<div class="lc-quests-hero-text">' +
      "<h1>" +
      escapeHtml(t("flow.questHeroTitle")) +
      "</h1>" +
      "<p>" +
      escapeHtml(t("flow.questHeroDesc")) +
      "</p></div>" +
      '<div class="lc-quests-hero-art" aria-hidden="true">' +
      '<div class="lc-quests-hero-lift">' +
      '<div class="lc-quests-hero-chest"></div>' +
      '<div class="lc-quests-frog" data-frog-logo></div>' +
      "</div></div></div>" +
      '<div class="lc-quests-summary">' +
      '<span class="lc-quests-summary-label">' +
      escapeHtml(t("flow.questSummary", { done: summary.done, total: summary.total })) +
      "</span>" +
      (summary.gemsAvailable > 0
        ? '<button type="button" class="lc-quests-claim-all" data-quest-claim-all>' +
          escapeHtml(t("flow.questClaimAll", { n: summary.gemsAvailable })) +
          "</button>"
        : "") +
      (allDone
        ? '<p class="lc-quests-all-done">' + escapeHtml(t("flow.questAllDoneToday")) + "</p>"
        : "") +
      "</div>" +
      '<section class="lc-quests-daily">' +
      '<div class="lc-quests-daily-head">' +
      "<h2>" +
      escapeHtml(t("flow.learnDailyTitle")) +
      "</h2>" +
      '<span class="lc-quests-timer">' +
      '<span class="lc-quests-timer-icon" aria-hidden="true"></span>' +
      escapeHtml(t("flow.questHoursLeft", { n: hours })) +
      "</span></div>" +
      cards +
      "</section>"
    );
  }

  function renderAside() {
    var summary = global.RNFQuestSystem ? RNFQuestSystem.getSummary() : { gemsEarned: 0 };
    return (
      '<div class="lc-quests-monthly">' +
      '<div class="lc-quests-monthly-medal" aria-hidden="true">' +
      '<span class="lc-quests-monthly-coin"></span>' +
      '<span class="lc-quests-monthly-bolt">💎</span></div>' +
      "<h2>" +
      escapeHtml(t("flow.questRewardsTitle")) +
      "</h2>" +
      "<p>" +
      escapeHtml(t("flow.questRewardsDesc", { n: 60 })) +
      "</p>" +
      '<p class="lc-quests-earned-today">' +
      escapeHtml(t("flow.questEarnedToday", { n: summary.gemsEarned || 0 })) +
      "</p>" +
      '<a class="lc-quests-monthly-cta" href="learn.html">' +
      escapeHtml(t("flow.leaderboardGoLearn")) +
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

  function bindQuestActions() {
    document.querySelectorAll("[data-quest-claim]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-quest-claim");
        if (!id || !global.RNFQuestSystem) return;
        var r = RNFQuestSystem.claim(id);
        if (r.ok) {
          showToast(t("flow.questClaimedToast", { n: r.reward }));
          init();
        }
      });
    });

    var claimAll = document.querySelector("[data-quest-claim-all]");
    if (claimAll) {
      claimAll.addEventListener("click", function () {
        if (!global.RNFQuestSystem) return;
        var r = RNFQuestSystem.claimAll();
        if (r.gems > 0) {
          showToast(t("flow.questClaimedToast", { n: r.gems }));
          init();
        }
      });
    }

    var checkinBtn = document.querySelector("[data-quest-checkin]");
    if (checkinBtn) {
      checkinBtn.addEventListener("click", function () {
        if (!global.RNFQuestSystem) return;
        RNFQuestSystem.doCheckin();
        showToast(t("flow.questCheckinDone"));
        init();
      });
    }
  }

  function showToast(msg) {
    var el = document.getElementById("lcQuestToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "lcQuestToast";
      el.className = "lc-quest-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2600);
  }

  function init() {
    var stats = global.LCApp
      ? LCApp.getLearnStats()
      : { streak: 1, gems: 0, hearts: 5, dailyXp: 0, target: "en" };

    var main = document.getElementById("questsMain");
    var side = document.getElementById("questsSide");
    if (main) {
      main.innerHTML = renderMain();
      bindQuestActions();
    }
    if (side) {
      side.innerHTML = renderAside();
    }

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    if (global.LCApp && LCApp.syncLearnCourseLabel) LCApp.syncLearnCourseLabel();
    if (global.LCApp && LCApp.initCoursePicker) LCApp.initCoursePicker();
    if (global.LCApp && LCApp.initStreakPicker) LCApp.initStreakPicker();
    if (global.LCApp && LCApp.initGemsPicker) LCApp.initGemsPicker();
    if (global.LCApp && LCApp.initHeartsPicker) LCApp.initHeartsPicker();
  }

  global.RNFQuests = { init: init, showToast: showToast };
})(typeof window !== "undefined" ? window : this);
