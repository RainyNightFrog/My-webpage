/**
 * Shared learn-page chrome: top bar (stats + site language), friends nav link
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

  function syncLearnCourseLabel() {
    var el = document.querySelector("[data-learn-lang-label]");
    if (!el || !global.LCApp) return;
    var target = LCApp.getLearnTarget ? LCApp.getLearnTarget() : "en";
    var key =
      target === "zh" ? "flow.courseZh" : COURSE_KEYS[target] || "flow.courseEn";
    el.textContent = (LANG_FLAGS[target] || "") + " " + t(key);
  }

  function renderTopStats() {
    if (!global.LCApp || !LCApp.renderLearnStatsBar || !LCApp.getLearnStats) {
      return "";
    }
    return LCApp.renderLearnStatsBar(LCApp.getLearnStats()).replace(
      'class="lc-learn-stats"',
      'class="lc-learn-stats lc-learn-top-stats"'
    );
  }

  function injectFriendsNav() {
    var menu = document.querySelector(".lc-learn-menu");
    if (!menu || menu.querySelector('a[href="friends.html"]')) return;
    var li = document.createElement("li");
    var active = /friends\.html/i.test(location.pathname || "") ? " active" : "";
    li.innerHTML =
      '<a class="lc-learn-link' +
      active +
      '" href="friends.html">' +
      '<span class="lc-learn-link-icon" aria-hidden="true">👥</span>' +
      '<span data-i18n="flow.navFriends">好友</span></a>';
    var more = menu.querySelector(".lc-learn-more-wrap");
    if (more) menu.insertBefore(li, more);
    else menu.appendChild(li);
  }

  function ensureLearnStage() {
    var shell = document.querySelector(".lc-learn-shell");
    if (!shell) return;
    var body = shell.querySelector(":scope > .lc-learn-body");
    if (!body || shell.querySelector(".lc-learn-stage")) return;

    var nav = shell.querySelector(".lc-learn-nav");
    var langLbl = nav && nav.querySelector("[data-learn-lang-label]");
    var langMount = document.getElementById("langTriggerMount");
    if (langLbl) langLbl.remove();
    if (langMount && langMount.parentNode === nav) langMount.remove();

    var stage = document.createElement("div");
    stage.className = "lc-learn-stage";

    var topbar = document.createElement("header");
    topbar.className = "lc-learn-topbar";
    topbar.setAttribute("aria-label", "Status");
    topbar.innerHTML =
      '<p class="lc-learn-topbar-course" data-learn-lang-label></p>' +
      '<div class="lc-learn-topbar-actions">' +
      '<div id="learnStatsMount" class="lc-learn-stats-mount"></div>' +
      '<div id="langTriggerMount" class="lc-learn-lang-mount-top"></div>' +
      "</div>";

    body.parentNode.insertBefore(stage, body);
    stage.appendChild(topbar);
    stage.appendChild(body);
  }

  function initLearnChrome() {
    injectFriendsNav();
    ensureLearnStage();
    syncLearnCourseLabel();
    var statsMount = document.getElementById("learnStatsMount");
    if (statsMount) statsMount.innerHTML = renderTopStats();
    if (global.LCApp && LCApp.initLangPopover) {
      LCApp.initLangPopover("langTriggerMount");
    }
  }

  global.LCApp = global.LCApp || {};
  global.LCApp.initLearnChrome = initLearnChrome;
  global.LCApp.syncLearnCourseLabel = syncLearnCourseLabel;
})(typeof window !== "undefined" ? window : this);
