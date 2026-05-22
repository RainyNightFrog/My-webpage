/**
 * Rainy Night Frog shared UI
 */
(function (global) {
  var SITE_LANGS = [
    { code: "zhHant", fullKey: "flow.langFullZh", labelKey: "flow.siteLangZhHant" },
    { code: "zhHans", fullKey: "flow.langFullZh", labelKey: "flow.siteLangZhHans" },
    { code: "en", fullKey: "flow.langFullEn", labelKey: "flow.siteLangEn" },
    { code: "es", fullKey: "flow.langFullEs", labelKey: "flow.siteLangEs" },
    { code: "ja", fullKey: "flow.langFullJa", labelKey: "flow.siteLangJa" },
  ];

  /** 網站介面語言（雙欄）；app = 完整翻譯，無 app 則暫以 English 介面顯示 */
  var UI_LANG_OPTIONS = [
    { code: "en", flag: "🇺🇸", native: "English", app: "en" },
    { code: "zhHant", flag: "繁", native: "繁體中文", app: "zhHant" },
    { code: "es", flag: "🇪🇸", native: "Español", app: "es" },
    { code: "zhHans", flag: "简", native: "简体中文", app: "zhHans" },
    { code: "ja", flag: "🇯🇵", native: "日本語", app: "ja" },
    { code: "ar", flag: "🇸🇦", native: "العربية", app: null },
    { code: "bn", flag: "🇧🇩", native: "বাংলা", app: null },
    { code: "cs", flag: "🇨🇿", native: "Čeština", app: null },
    { code: "de", flag: "🇩🇪", native: "Deutsch", app: null },
    { code: "el", flag: "🇬🇷", native: "Ελληνικά", app: null },
    { code: "fr", flag: "🇫🇷", native: "Français", app: null },
    { code: "hi", flag: "🇮🇳", native: "हिंदी", app: null },
    { code: "hu", flag: "🇭🇺", native: "Magyar", app: null },
    { code: "id", flag: "🇮🇩", native: "Bahasa Indonesia", app: null },
    { code: "it", flag: "🇮🇹", native: "Italiano", app: null },
    { code: "ko", flag: "🇰🇷", native: "한국어", app: null },
    { code: "nl", flag: "🇳🇱", native: "Nederlands", app: null },
    { code: "pl", flag: "🇵🇱", native: "Polski", app: null },
    { code: "pt", flag: "🇧🇷", native: "Português", app: null },
    { code: "ro", flag: "🇷🇴", native: "Română", app: null },
    { code: "ru", flag: "🇷🇺", native: "Русский", app: null },
    { code: "sv", flag: "🇸🇪", native: "Svenska", app: null },
    { code: "ta", flag: "🇮🇳", native: "தமிழ்", app: null },
    { code: "te", flag: "🇮🇳", native: "తెలుగు", app: null },
    { code: "th", flag: "🇹🇭", native: "ภาษาไทย", app: null },
    { code: "tl", flag: "🇵🇭", native: "Tagalog", app: null },
    { code: "tr", flag: "🇹🇷", native: "Türkçe", app: null },
    { code: "uk", flag: "🇺🇦", native: "Українською", app: null },
    { code: "vi", flag: "🇻🇳", native: "Tiếng Việt", app: null },
  ];

  var SUPPORTED_UI_LANGS = { en: 1, es: 1, ja: 1, zhHant: 1, zhHans: 1 };

  function uiLangItem(code) {
    for (var i = 0; i < UI_LANG_OPTIONS.length; i++) {
      if (UI_LANG_OPTIONS[i].code === code) return UI_LANG_OPTIONS[i];
    }
    return null;
  }

  function uiLangIsFullySupported(item) {
    return item && item.app && SUPPORTED_UI_LANGS[item.app];
  }

  function showLangToast(msg) {
    var el = document.getElementById("lcLangToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "lcLangToast";
      el.className = "lc-lang-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(showLangToast._t);
    showLangToast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 3200);
  }

  function applyUiLangChoice(uiCode) {
    var item = uiLangItem(uiCode);
    if (!item || !global.AppI18n) return { ok: false };

    if (uiLangIsFullySupported(item)) {
      AppI18n.setLang(item.app);
      if (item.app === "zhHant" || item.app === "zhHans") {
        try {
          sessionStorage.setItem("rnf_chinese_ui", item.app);
        } catch (e) {}
      }
      return { ok: true, fallback: false };
    }

    AppI18n.setLang("en");
    return { ok: true, fallback: true };
  }

  function isUiLangActive(item, appLang) {
    if (!item || !item.app) return false;
    return item.app === appLang;
  }

  function siteLangTriggerShort(appLang) {
    if (global.AppI18n) {
      if (appLang === "zhHant") return AppI18n.t("flow.siteLangZhHant");
      if (appLang === "zhHans") return AppI18n.t("flow.siteLangZhHans");
    }
    for (var i = 0; i < UI_LANG_OPTIONS.length; i++) {
      if (UI_LANG_OPTIONS[i].app === appLang) return UI_LANG_OPTIONS[i].native;
    }
    return "English";
  }

  var LEARN_COURSES = [
    { code: "zh", flag: "🇨🇳", labelKey: "flow.courseZh" },
    { code: "en", flag: "🇺🇸", labelKey: "flow.courseEn" },
    { code: "es", flag: "🇪🇸", labelKey: "flow.courseEs" },
    { code: "fr", flag: "🇫🇷", labelKey: "flow.courseFr" },
    { code: "ja", flag: "🇯🇵", labelKey: "flow.courseJa" },
    { code: "de", flag: "🇩🇪", labelKey: "flow.courseDe" },
    { code: "ko", flag: "🇰🇷", labelKey: "flow.courseKo" },
    { code: "it", flag: "🇮🇹", labelKey: "flow.courseIt" },
    { code: "pt", flag: "🇧🇷", labelKey: "flow.coursePt" },
  ];

  function courseMeta(code) {
    for (var i = 0; i < LEARN_COURSES.length; i++) {
      if (LEARN_COURSES[i].code === code) return LEARN_COURSES[i];
    }
    return { code: code, flag: "🌐", labelKey: "flow.courseEn" };
  }

  function getLearnTarget() {
    return sessionStorage.getItem("learn_target") || "en";
  }

  function getEnrolledCourses() {
    var current = getLearnTarget();
    try {
      var raw = localStorage.getItem("rnf_courses");
      if (raw) {
        var list = JSON.parse(raw);
        if (Array.isArray(list) && list.length) {
          if (list.indexOf(current) === -1) list.unshift(current);
          return list;
        }
      }
    } catch (e) {}
    return [current];
  }

  function addEnrolledCourse(code) {
    var list = getEnrolledCourses();
    if (list.indexOf(code) === -1) {
      list.push(code);
      try {
        localStorage.setItem("rnf_courses", JSON.stringify(list));
      } catch (e) {}
    }
  }

  function setLearnTarget(code) {
    sessionStorage.setItem("learn_target", code);
    addEnrolledCourse(code);
    /* 學習語言與網站介面語言分開：介面僅由 initLangPopover / applyUiLangChoice 或 setChineseLearnVariant 變更 */
    document.dispatchEvent(
      new CustomEvent("lc:coursechange", { detail: { target: code } })
    );
  }

  /** 中文課程：分別設定學習目標 (zh) 與介面繁/簡 */
  function setChineseLearnVariant(uiLang) {
    var lang = uiLang === "zhHans" ? "zhHans" : "zhHant";
    try {
      sessionStorage.setItem("learn_target", "zh");
      sessionStorage.setItem("rnf_chinese_ui", lang);
    } catch (e) {}
    addEnrolledCourse("zh");
    if (global.AppI18n && AppI18n.setLang) {
      AppI18n.setLang(lang);
    }
    document.dispatchEvent(
      new CustomEvent("lc:coursechange", { detail: { target: "zh", uiLang: lang } })
    );
    document.dispatchEvent(
      new CustomEvent("lc:langchange", { detail: { lang: lang } })
    );
  }

  function courseStatPill(target) {
    var m = courseMeta(target || getLearnTarget());
    return (
      '<button type="button" class="lc-stat-pill lc-stat-pill--course" data-course-picker aria-expanded="false" aria-haspopup="menu">' +
      '<span class="lc-stat-flag">' +
      m.flag +
      '</span><span class="lc-stat-num">1</span></button>'
    );
  }

  function streakStatPill(count) {
    var n = count == null ? 1 : count;
    return (
      '<button type="button" class="lc-stat-pill lc-stat-pill--streak" data-streak-picker aria-expanded="false" aria-haspopup="dialog">' +
      "<span aria-hidden=\"true\">🔥</span>" +
      '<span class="lc-stat-num">' +
      n +
      "</span></button>"
    );
  }

  function getStreakData(target) {
    var code = target || getLearnTarget();
    var data = { count: 1, lastDate: "" };
    try {
      var raw = localStorage.getItem("rnf_streak_" + code);
      if (raw) data = JSON.parse(raw);
    } catch (e) {}
    if (!data.count) data.count = 1;
    return data;
  }

  function getStreakWeekStrip(streakCount, lastDateStr) {
    var keys = [
      "daySun",
      "dayMon",
      "dayTue",
      "dayWed",
      "dayThu",
      "dayFri",
      "daySat",
    ];
    var today = new Date();
    var sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    var practiced = {};
    if (lastDateStr && streakCount > 0) {
      var last = new Date(lastDateStr);
      if (!isNaN(last.getTime())) {
        for (var i = 0; i < streakCount; i++) {
          var d = new Date(last);
          d.setDate(last.getDate() - i);
          practiced[d.toDateString()] = true;
        }
      }
    }
    var out = [];
    for (var j = 0; j < 7; j++) {
      var day = new Date(sunday);
      day.setDate(sunday.getDate() + j);
      var ds = day.toDateString();
      out.push({
        label: global.AppI18n ? AppI18n.t("flow." + keys[j]) : keys[j],
        done: !!practiced[ds],
        today: ds === today.toDateString(),
      });
    }
    return out;
  }

  function gemsStatPill(gems) {
    var n = gems == null ? 0 : gems;
    return (
      '<button type="button" class="lc-stat-pill lc-stat-pill--gems" data-gems-picker aria-expanded="false" aria-haspopup="dialog">' +
      "<span aria-hidden=\"true\">💎</span>" +
      '<span class="lc-stat-num">' +
      n +
      "</span></button>"
    );
  }

  var MAX_HEARTS = 5;
  var HEART_REFILL_COST = 350;

  function saveHearts(n) {
    try {
      var target = getLearnTarget();
      localStorage.setItem(
        "rnf_hearts_" + target,
        String(Math.min(MAX_HEARTS, Math.max(0, n)))
      );
    } catch (e) {}
  }

  function refillHeartsFromGems() {
    var stats = getLearnStats();
    if (stats.hearts >= MAX_HEARTS || stats.gems < HEART_REFILL_COST) return false;
    try {
      var target = getLearnTarget();
      localStorage.setItem(
        "rnf_gems_" + target,
        String(stats.gems - HEART_REFILL_COST)
      );
      saveHearts(MAX_HEARTS);
    } catch (e) {
      return false;
    }
    document.dispatchEvent(new CustomEvent("lc:heartschange"));
    return true;
  }

  function heartsStatPill(hearts) {
    var n = hearts == null ? MAX_HEARTS : hearts;
    return (
      '<button type="button" class="lc-stat-pill lc-stat-pill--hearts" data-hearts-picker aria-expanded="false" aria-haspopup="dialog">' +
      "<span aria-hidden=\"true\">❤️</span>" +
      '<span class="lc-stat-num">' +
      n +
      "</span></button>"
    );
  }

  function renderLearnStatsBar(stats) {
    return (
      '<div class="lc-learn-stats">' +
      courseStatPill(stats.target) +
      streakStatPill(stats.streak) +
      gemsStatPill(stats.gems) +
      heartsStatPill(stats.hearts) +
      "</div>"
    );
  }

  function getUnitsCompleted() {
    try {
      return parseInt(localStorage.getItem("rnf_units_done") || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function incrementUnitsCompleted() {
    try {
      var n = getUnitsCompleted() + 1;
      localStorage.setItem("rnf_units_done", String(n));
      return n;
    } catch (e) {
      return 0;
    }
  }

  function getLearnStats() {
    var target = getLearnTarget();
    var streak = 1;
    var gems = 0;
    var hearts = 5;
    var dailyXp = 0;
    var dailyGoal = 10;
    try {
      var sk = "rnf_streak_" + target;
      var raw = localStorage.getItem(sk);
      if (raw) streak = JSON.parse(raw).count || 1;
      gems = parseInt(localStorage.getItem("rnf_gems_" + target) || "0", 10) || 0;
      hearts = parseInt(localStorage.getItem("rnf_hearts_" + target) || "5", 10) || 5;
      hearts = Math.min(5, Math.max(0, hearts));
      var dk =
        "rnf_daily_xp_" +
        target +
        "_" +
        new Date().toISOString().slice(0, 10);
      var dailyRaw = localStorage.getItem(dk);
      if (dailyRaw) dailyXp = JSON.parse(dailyRaw).xp || 0;
    } catch (e) {}
    return {
      target: target,
      streak: streak,
      gems: gems,
      hearts: hearts,
      dailyXp: dailyXp,
      dailyGoal: dailyGoal,
    };
  }

  function initLangPopover(triggerMountId) {
    var mount = document.getElementById(triggerMountId || "langTriggerMount");
    if (!mount || !global.AppI18n) return;
    if (mount.dataset.langPopInited === "1") return;
    mount.dataset.langPopInited = "1";
    mount.innerHTML = "";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "lc-lang-trigger";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.innerHTML =
      '<span data-lang-label></span> <span class="chev" aria-hidden="true">▼</span>';

    var pop = document.createElement("div");
    pop.className = "lc-lang-popover";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", AppI18n.t("flow.siteLangPick"));

    var grid = document.createElement("div");
    grid.className = "lc-lang-grid";

    UI_LANG_OPTIONS.forEach(function (item) {
      var full = uiLangIsFullySupported(item);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "lc-lang-opt" +
        (isUiLangActive(item, AppI18n.getLang()) ? " active" : "") +
        (full ? "" : " lc-lang-opt--preview");
      btn.dataset.lang = item.code;
      if (!full) {
        btn.title = AppI18n.t("flow.siteLangPreviewHint");
      }
      btn.innerHTML =
        '<span class="lc-lang-flag">' +
        item.flag +
        "</span>" +
        '<span class="lc-lang-label">' +
        item.native +
        "</span>" +
        (full ? "" : '<span class="lc-lang-preview-tag">EN</span>');
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var result = applyUiLangChoice(item.code);
        if (!result.ok) return;
        AppI18n.applyPage(document.body.dataset.i18nPage || null);
        syncActiveStates();
        updateTriggerLabel(trigger);
        pop.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        if (result.fallback) {
          showLangToast(AppI18n.t("flow.siteLangPreviewToast"));
        }
        document.dispatchEvent(new CustomEvent("lc:langchange", {
          detail: { lang: AppI18n.getLang(), ui: item.code, fallback: result.fallback },
        }));
      });
      grid.appendChild(btn);
    });

    pop.appendChild(grid);
    mount.appendChild(trigger);
    document.body.appendChild(pop);

    function syncActiveStates() {
      var appLang = AppI18n.getLang();
      grid.querySelectorAll(".lc-lang-opt").forEach(function (b) {
        var it = uiLangItem(b.dataset.lang);
        b.classList.toggle("active", isUiLangActive(it, appLang));
      });
    }

    function positionPop() {
      var r = trigger.getBoundingClientRect();
      pop.style.top = r.bottom + 10 + "px";
      pop.style.right = Math.max(12, window.innerWidth - r.right) + "px";
      pop.style.left = "auto";
      var popRect = pop.getBoundingClientRect();
      var arrowRight = popRect.right - (r.left + r.width / 2) - 7;
      pop.style.setProperty(
        "--lang-pop-arrow-right",
        Math.max(14, Math.min(popRect.width - 20, arrowRight)) + "px"
      );
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = pop.classList.toggle("open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) positionPop();
    });

    document.addEventListener("click", function (e) {
      if (pop.contains(e.target) || trigger.contains(e.target)) return;
      pop.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    });
    pop.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    window.addEventListener("resize", function () {
      if (pop.classList.contains("open")) positionPop();
    });

    function updateTriggerLabel(tr) {
      var c = AppI18n.getLang();
      tr.querySelector("[data-lang-label]").textContent =
        AppI18n.t("flow.siteLangLabel") + " " + siteLangTriggerShort(c);
    }

    updateTriggerLabel(trigger);
    document.addEventListener("lc:langchange", function () {
      syncActiveStates();
      updateTriggerLabel(trigger);
      pop.setAttribute("aria-label", AppI18n.t("flow.siteLangPick"));
    });
  }

  var moreMenuInited = false;
  var moreMenuPop = null;
  var moreMenuTrigger = null;

  function getProfileInitial() {
    try {
      var raw = localStorage.getItem("rnf_profile");
      if (!raw) return "";
      var p = JSON.parse(raw);
      var name = (p.name || "").trim();
      var email = (p.email || "").split("@")[0];
      var base = name ? name.replace(/\s+/g, "") : email;
      return base ? base.charAt(0).toUpperCase() : "";
    } catch (e) {
      return "";
    }
  }

  function getAvatarEmoji() {
    try {
      var e = localStorage.getItem("rnf_avatar_emoji");
      if (e && (!global.RNFAvatarPool || RNFAvatarPool.isValidEmoji(e))) return e;
      var raw = localStorage.getItem("rnf_profile");
      if (raw) {
        var p = JSON.parse(raw);
        if (
          p.avatarEmoji &&
          (!global.RNFAvatarPool || RNFAvatarPool.isValidEmoji(p.avatarEmoji))
        ) {
          return p.avatarEmoji;
        }
      }
    } catch (err) {}
    return "";
  }

  function refreshProfileNavIcon() {
    var link = document.querySelector('a.lc-learn-link[href="profile.html"]');
    if (!link) return;
    var icon = link.querySelector(".lc-learn-link-icon");
    if (!icon) return;
    var avatar = getAvatarEmoji();
    if (avatar) {
      icon.innerHTML =
        '<span class="lc-nav-profile-emoji" aria-hidden="true">' + avatar + "</span>";
      return;
    }
    var initial = getProfileInitial();
    if (initial) {
      icon.innerHTML =
        '<span class="lc-nav-profile-initial">' + initial + "</span>";
    } else {
      icon.textContent = "🐸";
    }
  }

  function buildMoreMenuHtml() {
    if (!global.AppI18n) return "";
    return (
      '<a role="menuitem" class="lc-more-item" href="report.html">' +
      '<span class="lc-more-item-icon lc-more-icon-test" aria-hidden="true">🐸</span>' +
      "<span>" +
      AppI18n.t("flow.moreEnglishTest") +
      "</span></a>" +
      '<a role="menuitem" class="lc-more-item" href="languages.html">' +
      '<span class="lc-more-item-icon" aria-hidden="true">🌍</span>' +
      "<span>" +
      AppI18n.t("flow.moreSchools") +
      "</span></a>" +
      '<hr class="lc-more-divider" />' +
      '<button type="button" role="menuitem" class="lc-more-item lc-more-item-btn" data-more-action="settings">' +
      "<span>" +
      AppI18n.t("flow.moreSettings") +
      "</span></button>" +
      '<a role="menuitem" class="lc-more-item" href="home.html#help">' +
      "<span>" +
      AppI18n.t("flow.moreHelp") +
      "</span></a>" +
      '<button type="button" role="menuitem" class="lc-more-item lc-more-item-btn lc-more-logout" data-more-action="logout">' +
      "<span>" +
      AppI18n.t("flow.moreLogout") +
      "</span></button>"
    );
  }

  function closeMoreMenu() {
    if (!moreMenuPop || !moreMenuTrigger) return;
    moreMenuPop.classList.remove("open");
    moreMenuPop.hidden = true;
    moreMenuTrigger.classList.remove("open");
    moreMenuTrigger.setAttribute("aria-expanded", "false");
  }

  function positionMoreMenu() {
    if (!moreMenuPop || !moreMenuTrigger) return;
    var r = moreMenuTrigger.getBoundingClientRect();
    moreMenuPop.style.position = "fixed";
    moreMenuPop.style.left = r.right + 10 + "px";
    moreMenuPop.style.top = Math.max(12, r.top - 4) + "px";
    moreMenuPop.style.right = "auto";
  }

  function handleMoreAction(action) {
    closeMoreMenu();
    if (action === "settings") {
      location.href = "settings.html";
      return;
    }
    if (action === "logout") {
      if (global.RNFPlayerAuth && RNFPlayerAuth.logout) {
        RNFPlayerAuth.logout();
      }
      location.href = "auth.html?mode=login";
    }
  }

  function initMoreMenu() {
    refreshProfileNavIcon();

    var trigger = document.querySelector("[data-nav-more]");
    if (!trigger) return;

    moreMenuTrigger = trigger;

    if (!moreMenuInited) {
      moreMenuPop = document.createElement("div");
      moreMenuPop.id = "lcMoreMenu";
      moreMenuPop.className = "lc-more-menu";
      moreMenuPop.setAttribute("role", "menu");
      moreMenuPop.hidden = true;
      document.body.appendChild(moreMenuPop);

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = !moreMenuPop.classList.contains("open");
        if (open) {
          moreMenuPop.innerHTML = buildMoreMenuHtml();
          moreMenuPop.querySelectorAll("[data-more-action]").forEach(function (btn) {
            btn.addEventListener("click", function () {
              handleMoreAction(btn.getAttribute("data-more-action"));
            });
          });
          positionMoreMenu();
          moreMenuPop.classList.add("open");
          moreMenuPop.hidden = false;
          trigger.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        } else {
          closeMoreMenu();
        }
      });

      document.addEventListener("click", closeMoreMenu);
      moreMenuPop.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      window.addEventListener("resize", function () {
        if (moreMenuPop.classList.contains("open")) positionMoreMenu();
      });

      moreMenuInited = true;
    } else if (moreMenuPop.classList.contains("open")) {
      moreMenuPop.innerHTML = buildMoreMenuHtml();
      moreMenuPop.querySelectorAll("[data-more-action]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          handleMoreAction(btn.getAttribute("data-more-action"));
        });
      });
    }

    document.addEventListener("lc:langchange", function () {
      if (moreMenuPop && moreMenuPop.classList.contains("open")) {
        moreMenuPop.innerHTML = buildMoreMenuHtml();
        moreMenuPop.querySelectorAll("[data-more-action]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            handleMoreAction(btn.getAttribute("data-more-action"));
          });
        });
      }
    });
  }

  var coursePickerInited = false;
  var coursePickerPop = null;
  var coursePickerTrigger = null;

  function buildCoursePickerHtml() {
    if (!global.AppI18n) return "";
    var current = getLearnTarget();
    var enrolled = getEnrolledCourses();
    var items = "";
    enrolled.forEach(function (code) {
      var m = courseMeta(code);
      var active = code === current ? " active" : "";
      items +=
        '<button type="button" role="menuitem" class="lc-course-picker-item' +
        active +
        '" data-course="' +
        code +
        '">' +
        '<span class="lc-course-picker-flag" aria-hidden="true">' +
        m.flag +
        "</span>" +
        "<span>" +
        AppI18n.t(m.labelKey) +
        "</span></button>";
    });
    return (
      '<p class="lc-course-picker-title">' +
      AppI18n.t("flow.myCourses") +
      "</p>" +
      '<div class="lc-course-picker-list">' +
      items +
      "</div>" +
      '<a class="lc-course-picker-add" href="languages.html">' +
      '<span class="lc-course-picker-add-icon" aria-hidden="true">+</span>' +
      "<span>" +
      AppI18n.t("flow.addNewCourse") +
      "</span></a>"
    );
  }

  function closeCoursePicker() {
    if (!coursePickerPop || !coursePickerTrigger) return;
    coursePickerPop.classList.remove("open");
    coursePickerPop.hidden = true;
    coursePickerTrigger.setAttribute("aria-expanded", "false");
  }

  function positionCoursePicker() {
    if (!coursePickerPop || !coursePickerTrigger) return;
    var r = coursePickerTrigger.getBoundingClientRect();
    coursePickerPop.style.position = "fixed";
    coursePickerPop.style.left = Math.max(12, r.left) + "px";
    coursePickerPop.style.top = r.bottom + 8 + "px";
    coursePickerPop.style.right = "auto";
  }

  function bindCoursePickerItems() {
    if (!coursePickerPop) return;
    coursePickerPop.querySelectorAll("[data-course]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.getAttribute("data-course");
        if (code) setLearnTarget(code);
        closeCoursePicker();
      });
    });
  }

  function openCoursePicker(trigger) {
    closeStreakPicker();
    closeGemsPicker();
    closeHeartsPicker();
    coursePickerTrigger = trigger;
    if (!coursePickerPop) return;
    coursePickerPop.innerHTML = buildCoursePickerHtml();
    bindCoursePickerItems();
    positionCoursePicker();
    coursePickerPop.classList.add("open");
    coursePickerPop.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  }

  function initCoursePicker() {
    if (!coursePickerInited) {
      coursePickerPop = document.createElement("div");
      coursePickerPop.id = "lcCoursePicker";
      coursePickerPop.className = "lc-course-picker";
      coursePickerPop.setAttribute("role", "menu");
      coursePickerPop.hidden = true;
      document.body.appendChild(coursePickerPop);

      document.addEventListener("click", closeCoursePicker);
      coursePickerPop.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      window.addEventListener("resize", function () {
        if (coursePickerPop.classList.contains("open")) positionCoursePicker();
      });

      document.addEventListener("lc:langchange", function () {
        if (coursePickerPop.classList.contains("open")) {
          coursePickerPop.innerHTML = buildCoursePickerHtml();
          bindCoursePickerItems();
        }
      });

      coursePickerInited = true;
    }

    document.querySelectorAll("[data-course-picker]").forEach(function (btn) {
      if (btn._rnfCoursePicker) return;
      btn._rnfCoursePicker = true;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (
          coursePickerPop.classList.contains("open") &&
          coursePickerTrigger === btn
        ) {
          closeCoursePicker();
        } else {
          closeStreakPicker();
          closeGemsPicker();
          closeHeartsPicker();
          closeCoursePicker();
          openCoursePicker(btn);
        }
      });
    });
  }

  var gemsPickerInited = false;
  var gemsPickerPop = null;
  var gemsPickerTrigger = null;

  function buildGemsPickerHtml() {
    if (!global.AppI18n) return "";
    var gems = getLearnStats().gems;
    return (
      '<div class="lc-gems-pop-inner">' +
      '<span class="lc-gems-pop-chest" aria-hidden="true">📦💎</span>' +
      '<div class="lc-gems-pop-body">' +
      "<h2>" +
      AppI18n.t("flow.gemsPopoverTitle") +
      "</h2>" +
      "<p>" +
      AppI18n.t("flow.gemsYouHave", { n: gems }) +
      "</p>" +
      '<a href="shop.html" class="lc-gems-pop-link">' +
      AppI18n.t("flow.gemsVisitShop") +
      "</a></div></div>"
    );
  }

  function closeGemsPicker() {
    if (!gemsPickerPop || !gemsPickerTrigger) return;
    gemsPickerPop.classList.remove("open");
    gemsPickerPop.hidden = true;
    gemsPickerTrigger.classList.remove("open");
    gemsPickerTrigger.setAttribute("aria-expanded", "false");
  }

  function positionGemsPicker() {
    if (!gemsPickerPop || !gemsPickerTrigger) return;
    var r = gemsPickerTrigger.getBoundingClientRect();
    gemsPickerPop.style.position = "fixed";
    var popW = 280;
    var left = r.left + r.width / 2 - popW / 2;
    gemsPickerPop.style.left = Math.max(12, Math.min(left, window.innerWidth - popW - 12)) + "px";
    gemsPickerPop.style.top = r.bottom + 10 + "px";
    gemsPickerPop.style.right = "auto";
    var caret = gemsPickerPop.querySelector(".lc-gems-picker-caret");
    if (caret) {
      var caretLeft = r.left + r.width / 2 - parseFloat(gemsPickerPop.style.left || 0);
      caret.style.left = Math.max(20, Math.min(caretLeft, popW - 20)) + "px";
    }
  }

  function openGemsPicker(trigger) {
    closeCoursePicker();
    closeStreakPicker();
    closeHeartsPicker();
    gemsPickerTrigger = trigger;
    if (!gemsPickerPop) return;
    gemsPickerPop.innerHTML =
      '<span class="lc-gems-picker-caret" aria-hidden="true"></span>' +
      buildGemsPickerHtml();
    trigger.classList.add("open");
    positionGemsPicker();
    gemsPickerPop.classList.add("open");
    gemsPickerPop.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  }

  function initGemsPicker() {
    if (!gemsPickerInited) {
      gemsPickerPop = document.createElement("div");
      gemsPickerPop.id = "lcGemsPicker";
      gemsPickerPop.className = "lc-gems-picker";
      gemsPickerPop.setAttribute("role", "dialog");
      gemsPickerPop.hidden = true;
      document.body.appendChild(gemsPickerPop);

      document.addEventListener("click", closeGemsPicker);
      gemsPickerPop.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      window.addEventListener("resize", function () {
        if (gemsPickerPop.classList.contains("open")) positionGemsPicker();
      });
      document.addEventListener("lc:langchange", function () {
        if (gemsPickerPop.classList.contains("open")) {
          gemsPickerPop.innerHTML =
            '<span class="lc-gems-picker-caret" aria-hidden="true"></span>' +
            buildGemsPickerHtml();
          positionGemsPicker();
        }
      });

      gemsPickerInited = true;
    }

    document.querySelectorAll("[data-gems-picker]").forEach(function (btn) {
      if (btn._rnfGemsPicker) return;
      btn._rnfGemsPicker = true;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (
          gemsPickerPop.classList.contains("open") &&
          gemsPickerTrigger === btn
        ) {
          closeGemsPicker();
        } else {
          closeHeartsPicker();
          openGemsPicker(btn);
        }
      });
    });
  }

  var heartsPickerInited = false;
  var heartsPickerPop = null;
  var heartsPickerTrigger = null;

  function buildHeartsPickerHtml() {
    if (!global.AppI18n) return "";
    var stats = getLearnStats();
    var hearts = Math.min(MAX_HEARTS, Math.max(0, stats.hearts));
    var full = hearts >= MAX_HEARTS;
    var canRefill = !full && stats.gems >= HEART_REFILL_COST;
    var icons = "";
    for (var i = 0; i < MAX_HEARTS; i++) {
      icons +=
        '<span class="lc-hearts-pop-heart' +
        (i < hearts ? " on" : "") +
        '" aria-hidden="true">❤️</span>';
    }
    var statusHtml = full
      ? "<p class=\"lc-hearts-pop-status-title\">" +
        AppI18n.t("flow.heartsFullTitle") +
        "</p><p class=\"lc-hearts-pop-status-sub\">" +
        AppI18n.t("flow.heartsFullEncourage") +
        "</p>"
      : "";
    var unlimitedRow =
      '<li><a href="super.html" class="lc-hearts-pop-row">' +
      '<span class="lc-hearts-pop-row-icon infinity" aria-hidden="true">♾️</span>' +
      "<span class=\"lc-hearts-pop-row-label\">" +
      AppI18n.t("flow.shopUnlimitedTitle") +
      "</span>" +
      '<span class="lc-hearts-pop-cta accent">' +
      AppI18n.t("flow.shopFreeTrial") +
      "</span></a></li>";
    var refillTag = canRefill ? "button" : "div";
    var refillAttrs = canRefill
      ? ' type="button" class="lc-hearts-pop-row" data-hearts-refill'
      : ' class="lc-hearts-pop-row disabled"';
    var refillAction = full
      ? AppI18n.t("flow.shopHeartsFull")
      : "💎 " + HEART_REFILL_COST;
    var refillRow =
      "<li><" +
      refillTag +
      refillAttrs +
      ">" +
      '<span class="lc-hearts-pop-row-icon" aria-hidden="true">🤍</span>' +
      "<span class=\"lc-hearts-pop-row-label\">" +
      AppI18n.t("flow.shopRefillTitle") +
      "</span>" +
      '<span class="lc-hearts-pop-cta' +
      (full || !canRefill ? " muted" : "") +
      '">' +
      refillAction +
      "</span></" +
      refillTag +
      "></li>";
    var practiceRow =
      '<li><a href="lesson.html" class="lc-hearts-pop-row">' +
      '<span class="lc-hearts-pop-row-icon plus" aria-hidden="true">❤️</span>' +
      "<span class=\"lc-hearts-pop-row-label\">" +
      AppI18n.t("flow.heartsPracticeEarn") +
      "</span>" +
      '<span class="lc-hearts-pop-cta">→</span></a></li>';
    return (
      "<h2 class=\"lc-hearts-pop-title\">" +
      AppI18n.t("flow.heartsPopoverTitle") +
      "</h2>" +
      '<div class="lc-hearts-pop-status">' +
      '<div class="lc-hearts-pop-icons">' +
      icons +
      "</div>" +
      statusHtml +
      "</div>" +
      '<ul class="lc-hearts-pop-list">' +
      unlimitedRow +
      refillRow +
      practiceRow +
      "</ul>"
    );
  }

  function closeHeartsPicker() {
    if (!heartsPickerPop) return;
    heartsPickerPop.classList.remove("open");
    heartsPickerPop.hidden = true;
    if (heartsPickerTrigger) {
      heartsPickerTrigger.classList.remove("open");
      heartsPickerTrigger.setAttribute("aria-expanded", "false");
    }
  }

  function positionHeartsPicker() {
    if (!heartsPickerPop || !heartsPickerTrigger) return;
    var r = heartsPickerTrigger.getBoundingClientRect();
    heartsPickerPop.style.position = "fixed";
    var popW = 300;
    var left = r.right - popW;
    heartsPickerPop.style.left = Math.max(12, left) + "px";
    heartsPickerPop.style.top = r.bottom + 10 + "px";
    heartsPickerPop.style.right = "auto";
    var caret = heartsPickerPop.querySelector(".lc-hearts-picker-caret");
    if (caret) {
      var caretLeft = r.left + r.width / 2 - parseFloat(heartsPickerPop.style.left || 0);
      caret.style.left = Math.max(20, Math.min(caretLeft, popW - 20)) + "px";
    }
  }

  function bindHeartsPickerActions() {
    if (!heartsPickerPop) return;
    heartsPickerPop.querySelectorAll("[data-hearts-refill]").forEach(function (refill) {
      refill.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (refillHeartsFromGems()) {
          heartsPickerPop.innerHTML =
            '<span class="lc-hearts-picker-caret" aria-hidden="true"></span>' +
            buildHeartsPickerHtml();
          bindHeartsPickerActions();
          positionHeartsPicker();
          document.querySelectorAll("[data-hearts-picker]").forEach(function (btn) {
            var s = getLearnStats();
            btn.querySelector(".lc-stat-num").textContent = String(s.hearts);
          });
        }
      });
    });
  }

  function openHeartsPicker(trigger) {
    closeCoursePicker();
    closeStreakPicker();
    closeGemsPicker();
    heartsPickerTrigger = trigger;
    if (!heartsPickerPop) return;
    heartsPickerPop.innerHTML =
      '<span class="lc-hearts-picker-caret" aria-hidden="true"></span>' +
      buildHeartsPickerHtml();
    bindHeartsPickerActions();
    trigger.classList.add("open");
    positionHeartsPicker();
    heartsPickerPop.classList.add("open");
    heartsPickerPop.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  }

  function initHeartsPicker() {
    if (!heartsPickerInited) {
      heartsPickerPop = document.createElement("div");
      heartsPickerPop.id = "lcHeartsPicker";
      heartsPickerPop.className = "lc-hearts-picker";
      heartsPickerPop.setAttribute("role", "dialog");
      heartsPickerPop.hidden = true;
      document.body.appendChild(heartsPickerPop);

      document.addEventListener("click", closeHeartsPicker);
      heartsPickerPop.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      window.addEventListener("resize", function () {
        if (heartsPickerPop.classList.contains("open")) positionHeartsPicker();
      });
      document.addEventListener("lc:langchange", function () {
        if (heartsPickerPop.classList.contains("open")) {
          heartsPickerPop.innerHTML =
            '<span class="lc-hearts-picker-caret" aria-hidden="true"></span>' +
            buildHeartsPickerHtml();
          bindHeartsPickerActions();
          positionHeartsPicker();
        }
      });
      document.addEventListener("lc:heartschange", function () {
        if (heartsPickerPop.classList.contains("open")) {
          heartsPickerPop.innerHTML =
            '<span class="lc-hearts-picker-caret" aria-hidden="true"></span>' +
            buildHeartsPickerHtml();
          bindHeartsPickerActions();
        }
        document.querySelectorAll("[data-hearts-picker]").forEach(function (btn) {
          var s = getLearnStats();
          var num = btn.querySelector(".lc-stat-num");
          if (num) num.textContent = String(s.hearts);
        });
      });

      heartsPickerInited = true;
    }

    document.querySelectorAll("[data-hearts-picker]").forEach(function (btn) {
      if (btn._rnfHeartsPicker) return;
      btn._rnfHeartsPicker = true;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (
          heartsPickerPop.classList.contains("open") &&
          heartsPickerTrigger === btn
        ) {
          closeHeartsPicker();
        } else {
          openHeartsPicker(btn);
        }
      });
    });
  }

  var streakPickerInited = false;
  var streakPickerPop = null;
  var streakPickerTrigger = null;

  function buildStreakPickerHtml() {
    if (!global.AppI18n) return "";
    var target = getLearnTarget();
    var data = getStreakData(target);
    var count = data.count || 1;
    var days = getStreakWeekStrip(count, data.lastDate);
    var dayHtml = "";
    days.forEach(function (d) {
      dayHtml +=
        '<div class="lc-streak-pop-day' +
        (d.today ? " today" : "") +
        '">' +
        '<span class="lc-streak-pop-day-lbl">' +
        d.label +
        "</span>" +
        '<span class="lc-streak-pop-dot' +
        (d.done ? " done" : "") +
        '">' +
        (d.done ? "✓" : "") +
        "</span></div>";
    });
    var eliteLocked = count < 7;
    return (
      '<div class="lc-streak-pop-hero">' +
      '<div class="lc-streak-pop-hero-text">' +
      "<h2>" +
      AppI18n.t("flow.streakPopoverDays", { n: count }) +
      "</h2>" +
      "<p>" +
      AppI18n.t("flow.streakBestRecord") +
      "</p></div>" +
      '<span class="lc-streak-pop-flame" aria-hidden="true">🔥</span></div>' +
      '<div class="lc-streak-pop-week">' +
      dayHtml +
      "</div>" +
      '<div class="lc-streak-pop-friends">' +
      '<div class="lc-streak-pop-friends-art" aria-hidden="true">🐸👩</div>' +
      '<div class="lc-streak-pop-friends-body">' +
      "<h3>" +
      AppI18n.t("flow.streakFriendsTitle") +
      "</h3>" +
      "<p>" +
      AppI18n.t("flow.streakFriendsActive", { n: 0 }) +
      "</p>" +
      '<button type="button" class="lc-streak-pop-friends-btn">' +
      AppI18n.t("flow.streakFriendsView") +
      "</button></div></div>" +
      '<div class="lc-streak-pop-elite' +
      (eliteLocked ? " locked" : "") +
      '">' +
      '<span class="lc-streak-pop-lock" aria-hidden="true">' +
      (eliteLocked ? "🔒" : "🏆") +
      "</span>" +
      '<div class="lc-streak-pop-elite-body">' +
      "<h3>" +
      AppI18n.t("flow.streakEliteTitle") +
      "</h3>" +
      "<p>" +
      AppI18n.t("flow.streakEliteDesc") +
      "</p></div></div>" +
      '<button type="button" class="lc-streak-pop-more" data-streak-more>' +
      AppI18n.t("flow.streakSeeMore") +
      "</button>"
    );
  }

  function closeStreakPicker() {
    if (!streakPickerPop || !streakPickerTrigger) return;
    streakPickerPop.classList.remove("open");
    streakPickerPop.hidden = true;
    streakPickerTrigger.setAttribute("aria-expanded", "false");
  }

  function positionStreakPicker() {
    if (!streakPickerPop || !streakPickerTrigger) return;
    var r = streakPickerTrigger.getBoundingClientRect();
    streakPickerPop.style.position = "fixed";
    streakPickerPop.style.left = Math.max(12, r.left - 40) + "px";
    streakPickerPop.style.top = r.bottom + 8 + "px";
    streakPickerPop.style.right = "auto";
    var maxH = window.innerHeight - r.bottom - 24;
    streakPickerPop.style.maxHeight = Math.max(280, maxH) + "px";
  }

  function openStreakPicker(trigger) {
    closeCoursePicker();
    closeGemsPicker();
    closeHeartsPicker();
    streakPickerTrigger = trigger;
    if (!streakPickerPop) return;
    streakPickerPop.innerHTML = buildStreakPickerHtml();
    positionStreakPicker();
    streakPickerPop.classList.add("open");
    streakPickerPop.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    var more = streakPickerPop.querySelector("[data-streak-more]");
    if (more) {
      more.addEventListener("click", function () {
        closeStreakPicker();
        location.href = "profile.html";
      });
    }
  }

  function initStreakPicker() {
    if (!streakPickerInited) {
      streakPickerPop = document.createElement("div");
      streakPickerPop.id = "lcStreakPicker";
      streakPickerPop.className = "lc-streak-picker";
      streakPickerPop.setAttribute("role", "dialog");
      streakPickerPop.hidden = true;
      document.body.appendChild(streakPickerPop);

      document.addEventListener("click", closeStreakPicker);
      streakPickerPop.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      window.addEventListener("resize", function () {
        if (streakPickerPop.classList.contains("open")) positionStreakPicker();
      });
      document.addEventListener("lc:langchange", function () {
        if (streakPickerPop.classList.contains("open")) {
          streakPickerPop.innerHTML = buildStreakPickerHtml();
        }
      });

      streakPickerInited = true;
    }

    document.querySelectorAll("[data-streak-picker]").forEach(function (btn) {
      if (btn._rnfStreakPicker) return;
      btn._rnfStreakPicker = true;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (
          streakPickerPop.classList.contains("open") &&
          streakPickerTrigger === btn
        ) {
          closeStreakPicker();
        } else {
          closeGemsPicker();
          closeHeartsPicker();
          openStreakPicker(btn);
        }
      });
    });
  }

  function setProgress(pct) {
    var fill = document.getElementById("progressFill");
    if (fill) fill.style.width = Math.min(100, Math.max(0, pct)) + "%";
  }

  function initScoreWidget(total, livesOverride) {
    var dots = document.getElementById("energyDots");
    var lessonPage =
      document.body && document.body.classList.contains("lc-lesson-page");
    if (dots) {
      dots.classList.remove("lc-lesson-hearts");
      if (!dots.querySelector(".lc-energy-pip")) {
        dots.innerHTML = "";
        for (var i = 0; i < 5; i++) {
          var pip = document.createElement("span");
          pip.className = "lc-energy-pip on";
          pip.setAttribute("aria-hidden", "true");
          dots.appendChild(pip);
        }
      }
    }
    var lives = 5;
    if (lessonPage) {
      lives =
        livesOverride != null && livesOverride !== undefined
          ? livesOverride
          : getLearnStats().hearts;
    }
    updateScoreDisplay({ correct: 0, total: total || 10, lives: lives });
  }

  function updateScoreDisplay(stats) {
    var root = document.getElementById("scoreDisplay");
    if (!root) return;
    var num = document.getElementById("scoreNum");
    var totalEl = document.getElementById("scoreTotal");
    if (num && stats.correct != null) num.textContent = String(stats.correct);
    if (totalEl && stats.total != null) totalEl.textContent = String(stats.total);
    var dots = document.getElementById("energyDots");
    if (dots && stats.lives != null) {
      var pips = dots.querySelectorAll(".lc-energy-pip");
      if (!pips.length) {
        initScoreWidget(stats.total, stats.lives);
        pips = dots.querySelectorAll(".lc-energy-pip");
      }
      for (var i = 0; i < pips.length; i++) {
        pips[i].classList.toggle("on", i < stats.lives);
        pips[i].classList.toggle("off", i >= stats.lives);
      }
      var livesN = Math.max(0, Math.min(5, stats.lives));
      dots.setAttribute(
        "aria-label",
        (global.AppI18n ? AppI18n.t("flow.livesRemaining") : "Lives") +
          ": " +
          livesN +
          "/5"
      );
    }
    if (stats.bump) {
      root.classList.remove("lc-score-bump");
      void root.offsetWidth;
      root.classList.add("lc-score-bump");
      setTimeout(function () {
        root.classList.remove("lc-score-bump");
      }, 500);
    }
    var label = root.querySelector(".lc-score-label");
    if (label && global.AppI18n) {
      label.textContent = AppI18n.t("flow.scoreCorrect");
    }
  }

  function bindOptionGroup(selector, single, onSelect) {
    document.querySelectorAll(selector).forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (single) {
          document.querySelectorAll(selector).forEach(function (b) {
            b.classList.remove("selected");
          });
        }
        btn.classList.add("selected");
        if (onSelect) onSelect(btn);
      });
    });
  }

  document.addEventListener("lc:langchange", function () {
    if (!global.AppI18n) return;
    var page =
      document.body && document.body.dataset.i18nPage
        ? document.body.dataset.i18nPage
        : null;
    AppI18n.applyPage(page);
  });

  /** 中文朗讀：普通話（簡體 zh-CN，繁體 zh-TW），不用粵語 zh-HK */
  function getChineseSpeechLang() {
    try {
      if (global.AppI18n && AppI18n.getLang) {
        var ui = AppI18n.getLang();
        if (ui === "zhHans") return "zh-CN";
        if (ui === "zhHant") return "zh-TW";
      }
      var stored = sessionStorage.getItem("rnf_chinese_ui");
      if (stored === "zhHans") return "zh-CN";
      if (stored === "zhHant") return "zh-TW";
    } catch (e) {}
    return "zh-CN";
  }

  function isCantoneseVoice(voice) {
    if (!voice) return false;
    var lang = (voice.lang || "").toLowerCase();
    var name = (voice.name || "").toLowerCase();
    if (lang.indexOf("hk") >= 0 || lang.indexOf("yue") >= 0) return true;
    return /cantonese|yue|hong kong|廣東|广东|粤语|粵語|香港/.test(name);
  }

  var LEARN_SPEECH_LANG = {
    zh: "zh-CN",
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    pt: "pt-PT",
    ja: "ja-JP",
    ko: "ko-KR",
  };

  function getLearnSpeechLang(course) {
    var c = course || getLearnTarget();
    if (c === "zh") return getChineseSpeechLang();
    return LEARN_SPEECH_LANG[c] || "en-US";
  }

  function pickMandarinVoice(lang) {
    return pickVoiceForLang(lang, true);
  }

  function pickVoiceForLang(lang, mandarinOnly) {
    if (!global.speechSynthesis || !speechSynthesis.getVoices) return null;
    var voices = speechSynthesis.getVoices();
    if (!voices.length || !lang) return null;
    var base = lang.split("-")[0];
    var prefs =
      lang.indexOf("zh") === 0
        ? lang === "zh-TW"
          ? ["zh-TW", "zh-CN", "cmn-TW", "cmn-CN"]
          : ["zh-CN", "zh-TW", "cmn-CN", "cmn-TW"]
        : [lang, base];
    for (var p = 0; p < prefs.length; p++) {
      var code = prefs[p];
      for (var i = 0; i < voices.length; i++) {
        var v = voices[i];
        if (!v.lang) continue;
        var vl = v.lang.toLowerCase();
        if (vl.indexOf(code.toLowerCase()) !== 0) continue;
        if (mandarinOnly && isCantoneseVoice(v)) continue;
        return v;
      }
    }
    if (!mandarinOnly) {
      for (var j = 0; j < voices.length; j++) {
        var v2 = voices[j];
        if (v2.lang && v2.lang.toLowerCase().indexOf(base) === 0) return v2;
      }
    }
    return null;
  }

  function speakText(text, opts) {
    opts = opts || {};
    if (!text || !global.speechSynthesis) return;
    if (global.RNFSettings && !RNFSettings.isSoundEnabled()) return;
    speechSynthesis.cancel();
    var lang =
      opts.lang ||
      (opts.course ? getLearnSpeechLang(opts.course) : getLearnSpeechLang());
    var u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = opts.rate != null ? opts.rate : 0.92;
    u.volume =
      opts.volume != null
        ? opts.volume
        : global.RNFSettings && RNFSettings.getVolume
          ? RNFSettings.getVolume()
          : 1;

    function doSpeak() {
      var voice =
        lang.indexOf("zh") === 0
          ? pickMandarinVoice(lang)
          : pickVoiceForLang(lang, false);
      if (voice) u.voice = voice;
      speechSynthesis.speak(u);
    }

    if (speechSynthesis.getVoices().length) {
      doSpeak();
      return;
    }
    var done = false;
    function once() {
      if (done) return;
      done = true;
      doSpeak();
    }
    speechSynthesis.addEventListener("voiceschanged", once, { once: true });
    setTimeout(once, 300);
  }

  global.LCApp = {
    getLearnTarget: getLearnTarget,
    setLearnTarget: setLearnTarget,
    setChineseLearnVariant: setChineseLearnVariant,
    getEnrolledCourses: getEnrolledCourses,
    courseStatPill: courseStatPill,
    streakStatPill: streakStatPill,
    renderLearnStatsBar: renderLearnStatsBar,
    getStreakData: getStreakData,
    courseMeta: courseMeta,
    initCoursePicker: initCoursePicker,
    initStreakPicker: initStreakPicker,
    initGemsPicker: initGemsPicker,
    initHeartsPicker: initHeartsPicker,
    gemsStatPill: gemsStatPill,
    heartsStatPill: heartsStatPill,
    refillHeartsFromGems: refillHeartsFromGems,
    MAX_HEARTS: MAX_HEARTS,
    HEART_REFILL_COST: HEART_REFILL_COST,
    LEARN_COURSES: LEARN_COURSES,
    getLearnStats: getLearnStats,
    getUnitsCompleted: getUnitsCompleted,
    incrementUnitsCompleted: incrementUnitsCompleted,
    initLangPopover: initLangPopover,
    siteLangTriggerShort: siteLangTriggerShort,
    applyUiLangChoice: applyUiLangChoice,
    initMoreMenu: initMoreMenu,
    refreshProfileNavIcon: refreshProfileNavIcon,
    initScoreWidget: initScoreWidget,
    updateScoreDisplay: updateScoreDisplay,
    setProgress: setProgress,
    bindOptionGroup: bindOptionGroup,
    UI_LANG_OPTIONS: UI_LANG_OPTIONS,
    getChineseSpeechLang: getChineseSpeechLang,
    getLearnSpeechLang: getLearnSpeechLang,
    speakText: speakText,
  };
})(window);
