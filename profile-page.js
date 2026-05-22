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

  var pickerState = { emoji: "🐸", category: "all" };

  /** 若 avatar-pool.js 未載入時仍可選頭像 */
  var FALLBACK_AVATARS = [
    { id: "frog", emoji: "🐸", cats: ["land", "fun"] },
    { id: "bear", emoji: "🐻", cats: ["land"] },
    { id: "panda", emoji: "🐼", cats: ["land"] },
    { id: "fox", emoji: "🦊", cats: ["land"] },
    { id: "cat", emoji: "🐱", cats: ["land"] },
    { id: "dog", emoji: "🐶", cats: ["land"] },
    { id: "rabbit", emoji: "🐰", cats: ["land"] },
    { id: "tiger", emoji: "🐯", cats: ["land"] },
    { id: "lion", emoji: "🦁", cats: ["land"] },
    { id: "monkey", emoji: "🐵", cats: ["land"] },
    { id: "pig", emoji: "🐷", cats: ["land"] },
    { id: "koala", emoji: "🐨", cats: ["land"] },
    { id: "penguin", emoji: "🐧", cats: ["land", "sea"] },
    { id: "unicorn", emoji: "🦄", cats: ["land", "fun"] },
    { id: "butterfly", emoji: "🦋", cats: ["sky", "fun"] },
    { id: "bee", emoji: "🐝", cats: ["sky", "land"] },
    { id: "owl", emoji: "🦉", cats: ["sky", "land"] },
    { id: "parrot", emoji: "🦜", cats: ["sky"] },
    { id: "dolphin", emoji: "🐬", cats: ["sea"] },
    { id: "whale", emoji: "🐳", cats: ["sea"] },
    { id: "fish", emoji: "🐟", cats: ["sea"] },
    { id: "tropical", emoji: "🐠", cats: ["sea"] },
    { id: "octopus", emoji: "🐙", cats: ["sea"] },
    { id: "crab", emoji: "🦀", cats: ["sea"] },
    { id: "turtle", emoji: "🐢", cats: ["sea", "land"] },
    { id: "shark", emoji: "🦈", cats: ["sea"] },
    { id: "seal", emoji: "🦭", cats: ["sea"] },
    { id: "shell", emoji: "🐚", cats: ["sea"] },
    { id: "jelly", emoji: "🪼", cats: ["sea"] },
    { id: "star", emoji: "🌟", cats: ["fun"] },
    { id: "rainbow", emoji: "🌈", cats: ["fun"] },
  ];

  var FALLBACK_CATEGORIES = [
    { id: "all", labelKey: "flow.avatarCatAll" },
    { id: "land", labelKey: "flow.avatarCatLand" },
    { id: "sea", labelKey: "flow.avatarCatSea" },
    { id: "sky", labelKey: "flow.avatarCatSky" },
    { id: "fun", labelKey: "flow.avatarCatFun" },
  ];

  function getAvatarPoolApi() {
    if (global.RNFAvatarPool && global.RNFAvatarPool.listByCategory) {
      return global.RNFAvatarPool;
    }
    return {
      CATEGORIES: FALLBACK_CATEGORIES,
      listByCategory: function (catId) {
        if (!catId || catId === "all") return FALLBACK_AVATARS.slice();
        return FALLBACK_AVATARS.filter(function (a) {
          return a.cats.indexOf(catId) >= 0;
        });
      },
      isValidEmoji: function (emoji) {
        return FALLBACK_AVATARS.some(function (a) {
          return a.emoji === emoji;
        });
      },
    };
  }

  function getAvatarEmoji() {
    try {
      var e = localStorage.getItem("rnf_avatar_emoji");
      if (e && getAvatarPoolApi().isValidEmoji(e)) return e;
    } catch (err) {}
    return "";
  }

  function setAvatarEmoji(emoji) {
    if (!emoji) return;
    try {
      localStorage.setItem("rnf_avatar_emoji", emoji);
      localStorage.setItem("rnf_avatar_done", "1");
      var raw = localStorage.getItem("rnf_profile");
      var p = raw ? JSON.parse(raw) : {};
      p.avatarEmoji = emoji;
      localStorage.setItem("rnf_profile", JSON.stringify(p));
    } catch (err) {}
  }

  function profileAvatarInnerHtml(emoji) {
    if (emoji) {
      return (
        '<span class="lc-profile-avatar-emoji" aria-hidden="true">' +
        emoji +
        "</span>"
      );
    }
    return (
      '<span class="lc-profile-avatar-plus">+</span>' +
      '<span class="lc-profile-avatar-silhouette" aria-hidden="true"></span>'
    );
  }

  function openAvatarModal() {
    var modal = document.getElementById("avatarModal");
    if (!modal) return;
    pickerState.emoji = getAvatarEmoji() || "🐸";
    modal.hidden = false;
    renderAvatarPicker();
    requestAnimationFrame(function () {
      renderAvatarPicker();
    });
  }

  function closeAvatarModal() {
    var modal = document.getElementById("avatarModal");
    if (modal) modal.hidden = true;
  }

  function renderAvatarPicker() {
    var pool = getAvatarPoolApi();
    var preview = document.getElementById("avatarPickerPreview");
    if (preview) preview.textContent = pickerState.emoji;

    var tabsEl = document.getElementById("avatarPickerTabs");
    var gridEl = document.getElementById("avatarPickerGrid");
    if (!tabsEl || !gridEl) return;

    tabsEl.innerHTML = "";
    pool.CATEGORIES.forEach(function (cat) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "lc-avatar-picker-tab" +
        (pickerState.category === cat.id ? " on" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", pickerState.category === cat.id ? "true" : "false");
      btn.textContent = t(cat.labelKey);
      btn.addEventListener("click", function () {
        pickerState.category = cat.id;
        renderAvatarPicker();
      });
      tabsEl.appendChild(btn);
    });

    var list = pool.listByCategory(pickerState.category);
    gridEl.innerHTML = "";
    if (!list.length) {
      var empty = document.createElement("p");
      empty.className = "lc-avatar-picker-empty";
      empty.textContent = t("flow.avatarPickerSub");
      gridEl.appendChild(empty);
      return;
    }

    list.forEach(function (item) {
      var b = document.createElement("button");
      b.type = "button";
      b.className =
        "lc-avatar-picker-item" +
        (pickerState.emoji === item.emoji ? " selected" : "");
      b.setAttribute("aria-label", item.id);
      b.setAttribute("aria-pressed", pickerState.emoji === item.emoji ? "true" : "false");
      var span = document.createElement("span");
      span.className = "lc-avatar-picker-emoji";
      span.setAttribute("aria-hidden", "true");
      span.textContent = item.emoji;
      b.appendChild(span);
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        pickerState.emoji = item.emoji;
        renderAvatarPicker();
      });
      gridEl.appendChild(b);
    });
  }

  function applyAvatarToProfileButton() {
    var btn = document.getElementById("btnEditAvatar");
    if (!btn) return;
    var emoji = getAvatarEmoji();
    btn.innerHTML = profileAvatarInnerHtml(emoji);
    if (emoji) btn.classList.add("has-avatar");
    else btn.classList.remove("has-avatar");
  }

  var avatarModalListenersBound = false;

  function bindAvatarModal() {
    var modal = document.getElementById("avatarModal");
    if (!modal) return;

    if (!avatarModalListenersBound) {
      avatarModalListenersBound = true;
      var saveBtn = document.getElementById("btnAvatarSave");
      var laterBtn = document.getElementById("btnAvatarLater");
      var closeBtn = document.getElementById("btnAvatarClose");

      if (saveBtn) {
        saveBtn.onclick = function () {
          setAvatarEmoji(pickerState.emoji);
          applyAvatarToProfileButton();
          closeAvatarModal();
          if (global.LCApp && LCApp.refreshProfileNavIcon) {
            LCApp.refreshProfileNavIcon();
          }
        };
      }
      if (laterBtn) laterBtn.onclick = closeAvatarModal;
      if (closeBtn) closeBtn.onclick = closeAvatarModal;

      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeAvatarModal();
      });
    }

    if (!bindAvatarModal._welcomedOnce) {
      bindAvatarModal._welcomedOnce = true;
      try {
        if (localStorage.getItem("rnf_avatar_done") !== "1") {
          openAvatarModal();
        }
      } catch (e) {}
    }
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
        '<button type="button" class="lc-profile-avatar' +
        (getAvatarEmoji() ? " has-avatar" : "") +
        '" id="btnEditAvatar" aria-label="' +
        t("flow.profileEditAvatar") +
        '">' +
        profileAvatarInnerHtml(getAvatarEmoji()) +
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
        '<div class="lc-panel-card lc-profile-social-card">' +
        '<p class="lc-panel-text"><a class="lc-panel-link" href="friends.html">' +
        t("flow.navFriends") +
        " →</a></p>" +
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
      editBtn.onclick = openAvatarModal;
    }

    bindAvatarModal();
    applyAvatarToProfileButton();
    bindProfileTabs();

    if (global.LCApp && LCApp.refreshProfileNavIcon) {
      LCApp.refreshProfileNavIcon();
    }
    if (global.LCApp && LCApp.initCoursePicker) LCApp.initCoursePicker();
    if (global.LCApp && LCApp.initStreakPicker) LCApp.initStreakPicker();
    if (global.LCApp && LCApp.initGemsPicker) LCApp.initGemsPicker();
    if (global.LCApp && LCApp.initHeartsPicker) LCApp.initHeartsPicker();
  }

  global.RNFProfile = {
    init: init,
    getAvatarEmoji: getAvatarEmoji,
    openAvatarPicker: openAvatarModal,
    renderAvatarPicker: renderAvatarPicker,
  };
})(typeof window !== "undefined" ? window : this);
