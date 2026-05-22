/**
 * Super subscription compare — Rainy Night Frog
 */
(function (global) {
  var FEATURE_KEYS = [
    "flow.superFeatContent",
    "flow.superFeatHearts",
    "flow.superFeatSkills",
    "flow.superFeatMistakes",
    "flow.superFeatChallenges",
    "flow.superFeatAds",
  ];

  var FREE_HAS = [true, false, false, false, false, false];

  var COURSE_CODE = {
    en: "en",
    es: "es",
    fr: "fr",
    ja: "ja",
    zh: "zh-CN",
    de: "de",
    ko: "ko",
    it: "it",
    pt: "pt",
  };

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function getCourseCode() {
    var target = global.LCApp ? LCApp.getLearnTarget() : "zh";
    return COURSE_CODE[target] || target;
  }

  function cellMark(included) {
    if (included) {
      return '<span class="lc-super-check" aria-hidden="true">✓</span>';
    }
    return '<span class="lc-super-dash" aria-hidden="true">—</span>';
  }

  function renderTable() {
    var rows = "";
    FEATURE_KEYS.forEach(function (key, i) {
      rows +=
        "<tr>" +
        "<th scope=\"row\">" +
        t(key) +
        "</th>" +
        '<td class="lc-super-col-free">' +
        cellMark(FREE_HAS[i]) +
        "</td>" +
        '<td class="lc-super-col-super">' +
        cellMark(true) +
        "</td></tr>";
    });
    return (
      '<div class="lc-super-table-wrap">' +
      '<table class="lc-super-table">' +
      "<thead><tr>" +
      '<th scope="col" class="lc-super-th-feat"></th>' +
      '<th scope="col" class="lc-super-th-free">' +
      t("flow.superFreeLabel") +
      "</th>" +
      '<th scope="col" class="lc-super-th-super">' +
      '<span class="lc-super-logo">SUPER</span></th></tr></thead>' +
      "<tbody>" +
      rows +
      "</tbody></table></div>"
    );
  }

  function startTrial() {
    try {
      var target = global.LCApp ? LCApp.getLearnTarget() : "en";
      var until = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem("rnf_super_trial_" + target, String(until));
      localStorage.setItem("rnf_super_active", "1");
    } catch (e) {}
    if (document.referrer && /learn|shop|guide/.test(document.referrer)) {
      history.back();
    } else {
      location.href = "learn.html";
    }
  }

  function dismiss() {
    if (history.length > 1) {
      history.back();
    } else {
      location.href = "learn.html";
    }
  }

  function bindActions(root) {
    var trial = root.querySelector("[data-super-trial]");
    var skip = root.querySelector("[data-super-skip]");
    if (trial) trial.addEventListener("click", startTrial);
    if (skip) skip.addEventListener("click", dismiss);
  }

  function init() {
    var main = document.getElementById("superMain");
    if (!main) return;

    var langCode = getCourseCode();
    main.innerHTML =
      "<h1 class=\"lc-super-title\">" +
      t("flow.superCompareTitle", { lang: langCode }) +
      "</h1>" +
      renderTable() +
      '<div class="lc-super-actions">' +
      '<button type="button" class="lc-super-cta" data-super-trial>' +
      t("flow.shopSuperCta") +
      "</button>" +
      '<button type="button" class="lc-super-skip" data-super-skip>' +
      t("flow.superNoThanks") +
      "</button></div>";

    bindActions(main);
    document.title = t("flow.superPageTitle");
  }

  global.RNFSuper = { init: init };
})(typeof window !== "undefined" ? window : this);
