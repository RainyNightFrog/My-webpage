/**
 * Profile page — Rainy Night Frog
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

  function getProfile() {
    var data = { name: "", email: "" };
    try {
      var raw = localStorage.getItem("rnf_profile");
      if (raw) data = JSON.parse(raw);
    } catch (e) {}
    return data;
  }

  function getTotalXp() {
    try {
      return parseInt(localStorage.getItem("rnf_total_xp") || "14", 10) || 0;
    } catch (e) {
      return 14;
    }
  }

  function getTop3Finishes() {
    try {
      return parseInt(localStorage.getItem("rnf_top3_finishes") || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function formatJoinDate() {
    try {
      var raw = localStorage.getItem("rnf_profile_joined");
      if (!raw) return "";
      var d = new Date(raw);
      if (isNaN(d.getTime())) return "";
      return t("flow.profileJoined", {
        y: d.getFullYear(),
        m: d.getMonth() + 1,
      });
    } catch (e) {
      return "";
    }
  }

  function displayName(profile) {
    if (profile.name && profile.name.trim()) return profile.name.trim();
    if (profile.email) {
      var local = profile.email.split("@")[0];
      return local.charAt(0).toUpperCase() + local.slice(1);
    }
    return t("flow.profileGuest");
  }

  function username(profile) {
    if (profile.name && profile.name.trim()) {
      return profile.name.trim().replace(/\s+/g, "");
    }
    if (profile.email) return profile.email.split("@")[0];
    return "learner";
  }

  function renderStatsBar(stats) {
    var bar =
      global.LCApp && LCApp.renderLearnStatsBar
        ? LCApp.renderLearnStatsBar(stats)
        : '<div class="lc-learn-stats"></div>';
    return bar.replace(
      'class="lc-learn-stats"',
      'class="lc-learn-stats lc-profile-top-stats"'
    );
  }

  function statCard(icon, value, labelKey, muted) {
    var valClass = "lc-profile-stat-val";
    if (muted) valClass += " lc-muted";
    return (
      '<div class="lc-profile-stat-card">' +
      '<span class="lc-profile-stat-icon" aria-hidden="true">' +
      icon +
      "</span>" +
      '<span class="' +
      valClass +
      '">' +
      value +
      "</span>" +
      '<span class="lc-profile-stat-lbl">' +
      t(labelKey) +
      "</span></div>"
    );
  }

  function getUnitsDone() {
    if (global.LCApp && LCApp.getUnitsCompleted) {
      return LCApp.getUnitsCompleted();
    }
    try {
      return parseInt(localStorage.getItem("rnf_units_done") || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function achievementCard(icon, titleKey, descKey, current, max, level) {
    var pct = max ? Math.min(100, Math.round((current / max) * 100)) : 0;
    var lvl = level == null ? 1 : level;
    return (
      '<article class="lc-ach-card">' +
      '<span class="lc-ach-icon" aria-hidden="true">' +
      icon +
      "</span>" +
      '<div class="lc-ach-body">' +
      '<div class="lc-ach-head-row">' +
      "<h4>" +
      t(titleKey) +
      "</h4>" +
      '<span class="lc-ach-progress">' +
      current +
      "/" +
      max +
      "</span></div>" +
      '<p class="lc-ach-level">' +
      t("flow.achLevel", { n: lvl }) +
      "</p>" +
      '<div class="lc-ach-bar"><div class="lc-ach-fill" style="width:' +
      pct +
      '%"></div></div>' +
      '<p class="lc-ach-desc">' +
      t(descKey) +
      "</p></div></article>"
    );
  }

  function bindAvatarModal() {
    var modal = document.getElementById("avatarModal");
    if (!modal) return;
    try {
      if (localStorage.getItem("rnf_avatar_done") === "1") {
        modal.hidden = true;
        return;
      }
    } catch (e) {}

    modal.hidden = false;
    document.getElementById("btnAvatarStart").onclick = function () {
      try {
        localStorage.setItem("rnf_avatar_done", "1");
      } catch (e) {}
      modal.hidden = true;
    };
    document.getElementById("btnAvatarLater").onclick = function () {
      modal.hidden = true;
    };
  }

  function bindProfileTabs() {
    var tabs = document.querySelectorAll(".lc-profile-tab");
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (el) {
          el.classList.remove("on");
        });
        tab.classList.add("on");
      });
    });
  }

  function init() {
    var profile = getProfile();
    var stats = global.LCApp
      ? LCApp.getLearnStats()
      : { streak: 1, gems: 0, hearts: 5, target: "en" };
    var xp = getTotalXp();
    var top3 = getTop3Finishes();
    var unitsDone = getUnitsDone();
    var championDone = unitsDone >= 10 ? 1 : 0;
    var name = displayName(profile);
    var user = username(profile);
    var showDisplayName =
      name.replace(/\s+/g, "") !== user && name !== user;
    var joined = formatJoinDate() || t("flow.profileJoinedNow");
    var flag = LANG_FLAGS[stats.target] || "🌐";

    var main = document.getElementById("profileMain");
    var side = document.getElementById("profileSide");
    if (main) {
      main.innerHTML =
        '<header class="lc-profile-header">' +
        '<div class="lc-profile-avatar-wrap">' +
        '<button type="button" class="lc-profile-avatar" id="btnEditAvatar" aria-label="' +
        t("flow.profileEditAvatar") +
        '">' +
        '<span class="lc-profile-avatar-plus">+</span>' +
        '<span class="lc-profile-avatar-silhouette" aria-hidden="true"></span>' +
        "</button>" +
        '<span class="lc-profile-edit-badge" aria-hidden="true">✎</span></div>' +
        '<div class="lc-profile-ident-wrap">' +
        '<div class="lc-profile-ident">' +
        "<h1>" +
        (showDisplayName ? name : user) +
        "</h1>" +
        (showDisplayName
          ? '<p class="lc-profile-user">' + user + "</p>"
          : "") +
        '<p class="lc-profile-joined">' +
        joined +
        "</p>" +
        '<p class="lc-profile-social">' +
        '<a href="#" class="lc-profile-social-link">' +
        t("flow.profileFollowingCount", { n: 0 }) +
        "</a>" +
        '<a href="#" class="lc-profile-social-link">' +
        t("flow.profileFollowersCount", { m: 0 }) +
        "</a></p></div>" +
        '<span class="lc-profile-course-flag" aria-hidden="true">' +
        flag +
        "</span></div></header>" +
        '<section class="lc-profile-stats-section">' +
        "<h2>" +
        t("flow.profileStatsTitle") +
        "</h2>" +
        '<div class="lc-profile-stats-grid">' +
        statCard("🔥", stats.streak, "flow.profileStreakDays") +
        statCard("⚡", xp, "flow.profileTotalXp") +
        statCard("🛡️", t("flow.profileNoLeague"), "flow.profileLeague", true) +
        statCard("🏅", top3, "flow.profileTop3") +
        "</div></section>" +
        '<section class="lc-profile-ach">' +
        '<div class="lc-profile-ach-head">' +
        "<h2>" +
        t("flow.profileAchievements") +
        "</h2>" +
        '<a href="#" class="lc-panel-link">' +
        t("flow.learnShowAll") +
        "</a></div>" +
        '<div class="lc-ach-list">' +
        achievementCard("🔥", "flow.achWildfire", "flow.achWildfireDesc", stats.streak, 3) +
        achievementCard("🧙", "flow.achSage", "flow.achSageDesc", xp, 100) +
        achievementCard("🏆", "flow.achChampion", "flow.achChampionDesc", championDone, 1) +
        "</div></section>";
    }

    if (side) {
      side.innerHTML =
        renderStatsBar(stats) +
        '<div class="lc-panel-card lc-profile-social-card">' +
        '<div class="lc-profile-tabs">' +
        '<button type="button" class="lc-profile-tab on">' +
        t("flow.profileTabFollowing") +
        "</button>" +
        '<button type="button" class="lc-profile-tab">' +
        t("flow.profileTabFollowers") +
        "</button></div>" +
        '<div class="lc-profile-buddy-art" aria-hidden="true">🐸👋🎯</div>' +
        '<p class="lc-panel-text">' +
        t("flow.profileFindBuddies") +
        "</p></div>" +
        '<div class="lc-panel-card">' +
        "<h3 class=\"lc-panel-title\">" +
        t("flow.profileAddFriends") +
        "</h3>" +
        '<button type="button" class="lc-profile-action">' +
        "🔍 " +
        t("flow.profileSearchFriends") +
        "</button>" +
        '<button type="button" class="lc-profile-action lc-profile-action-invite">' +
        '<span class="lc-profile-invite-icon" aria-hidden="true">🐸</span> ' +
        t("flow.profileInviteFriends") +
        "</button></div>" +
        '<nav class="lc-panel-footer">' +
        '<a href="home.html">' +
        t("flow.learnFooterAbout") +
        "</a>" +
        '<a href="shop.html">' +
        t("flow.navShop") +
        "</a>" +
        '<a href="home.html">' +
        t("flow.profileFooterTerms") +
        "</a>" +
        '<a href="home.html">' +
        t("flow.privacyPolicy") +
        "</a></nav>";
    }

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

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    var editBtn = document.getElementById("btnEditAvatar");
    if (editBtn) {
      editBtn.onclick = function () {
        var modal = document.getElementById("avatarModal");
        if (modal) modal.hidden = false;
      };
    }

    bindAvatarModal();
    bindProfileTabs();

    if (global.LCApp && LCApp.refreshProfileNavIcon) {
      LCApp.refreshProfileNavIcon();
    }
    if (global.LCApp && LCApp.initCoursePicker) LCApp.initCoursePicker();
    if (global.LCApp && LCApp.initStreakPicker) LCApp.initStreakPicker();
    if (global.LCApp && LCApp.initGemsPicker) LCApp.initGemsPicker();
    if (global.LCApp && LCApp.initHeartsPicker) LCApp.initHeartsPicker();
  }

  global.RNFProfile = { init: init };
})(typeof window !== "undefined" ? window : this);
