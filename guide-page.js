/**
 * Section guide — Rainy Night Frog
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

  /** @type {{ topicKey: string, phrases: { side: string, primaryKey: string, transKey: string }[] }[]} */
  var GUIDES = {
    1: {
      topicKey: "flow.learnUnitTopic",
      phrases: [
        {
          side: "left",
          primaryKey: "flow.guideP1Primary",
          transKey: "flow.guideP1Trans",
        },
        {
          side: "right",
          primaryKey: "flow.guideP2Primary",
          transKey: "flow.guideP2Trans",
        },
        {
          side: "left",
          primaryKey: "flow.guideP3Primary",
          transKey: "flow.guideP3Trans",
        },
        {
          side: "right",
          primaryKey: "flow.guideP4Primary",
          transKey: "flow.guideP4Trans",
        },
        {
          side: "left",
          primaryKey: "flow.guideP5Primary",
          transKey: "flow.guideP5Trans",
        },
        {
          side: "left",
          primaryKey: "flow.guideP6Primary",
          transKey: "flow.guideP6Trans",
        },
      ],
    },
    2: {
      topicKey: "flow.learnSectionAsk",
      phrases: [
        {
          side: "left",
          primaryKey: "flow.guideAsk1Primary",
          transKey: "flow.guideAsk1Trans",
        },
        {
          side: "right",
          primaryKey: "flow.guideAsk2Primary",
          transKey: "flow.guideAsk2Trans",
        },
        {
          side: "left",
          primaryKey: "flow.guideAsk3Primary",
          transKey: "flow.guideAsk3Trans",
        },
        {
          side: "right",
          primaryKey: "flow.guideAsk4Primary",
          transKey: "flow.guideAsk4Trans",
        },
      ],
    },
    3: {
      topicKey: "flow.learnSectionTravel",
      phrases: [
        {
          side: "left",
          primaryKey: "flow.guideTravel1Primary",
          transKey: "flow.guideTravel1Trans",
        },
        {
          side: "right",
          primaryKey: "flow.guideTravel2Primary",
          transKey: "flow.guideTravel2Trans",
        },
        {
          side: "left",
          primaryKey: "flow.guideTravel3Primary",
          transKey: "flow.guideTravel3Trans",
        },
        {
          side: "right",
          primaryKey: "flow.guideTravel4Primary",
          transKey: "flow.guideTravel4Trans",
        },
      ],
    },
    4: {
      topicKey: "flow.learnUnitTopic6",
      phrases: [
        {
          side: "left",
          primaryKey: "flow.guideFamily1Primary",
          transKey: "flow.guideFamily1Trans",
        },
        {
          side: "right",
          primaryKey: "flow.guideFamily2Primary",
          transKey: "flow.guideFamily2Trans",
        },
        {
          side: "left",
          primaryKey: "flow.guideFamily3Primary",
          transKey: "flow.guideFamily3Trans",
        },
        {
          side: "right",
          primaryKey: "flow.guideFamily4Primary",
          transKey: "flow.guideFamily4Trans",
        },
      ],
    },
  };

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function getSectionId() {
    var m = /[?&]section=(\d+)/.exec(location.search);
    return m ? parseInt(m[1], 10) : 1;
  }

  function renderBubble(phrase) {
    return (
      '<div class="lc-guide-bubble lc-guide-bubble--' +
      phrase.side +
      '">' +
      '<div class="lc-guide-bubble-inner">' +
      '<p class="lc-guide-bubble-primary">' +
      t(phrase.primaryKey) +
      "</p>" +
      '<p class="lc-guide-bubble-trans">' +
      t(phrase.transKey) +
      "</p></div>" +
      '<button type="button" class="lc-guide-speak" aria-label="' +
      t("flow.guidePlayAudio") +
      '" data-speak="' +
      encodeURIComponent(t(phrase.primaryKey)) +
      '">' +
      '<span aria-hidden="true">🔊</span></button></div>'
    );
  }

  function bindSpeakButtons(root) {
    root.querySelectorAll(".lc-guide-speak").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = decodeURIComponent(btn.getAttribute("data-speak") || "");
        if (!text) return;
        if (global.LCApp && LCApp.speakText) {
          LCApp.speakText(text);
          return;
        }
        if (!global.speechSynthesis) return;
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = "zh-CN";
        u.rate = 0.92;
        speechSynthesis.speak(u);
      });
    });
  }

  function init() {
    var section = getSectionId();
    var guide = GUIDES[section] || GUIDES[1];
    var stats = global.LCApp
      ? LCApp.getLearnStats()
      : { streak: 1, gems: 505, hearts: 5, dailyXp: 10, dailyGoal: 10, target: "zh" };

    var main = document.getElementById("guideMain");
    var side = document.getElementById("sidePanel");

    if (main) {
      var phrasesHtml = "";
      guide.phrases.forEach(function (p) {
        phrasesHtml += renderBubble(p);
      });

      main.innerHTML =
        '<a class="lc-guide-back" href="learn.html">' +
        "← " +
        t("flow.guideBack") +
        "</a>" +
        '<div class="lc-guide-hero">' +
        '<div class="lc-guide-hero-owl" data-frog-logo aria-hidden="true"></div></div>' +
        "<h1 class=\"lc-guide-title\">" +
        t("flow.guideSectionTitle", { n: section }) +
        "</h1>" +
        '<p class="lc-guide-subtitle">' +
        t("flow.guideSectionSubtitle") +
        "</p>" +
        '<h2 class="lc-guide-phrases-head">' +
        t("flow.guideKeyPhrases") +
        "</h2>" +
        '<h3 class="lc-guide-topic">' +
        t(guide.topicKey) +
        "</h3>" +
        '<div class="lc-guide-chat">' +
        phrasesHtml +
        "</div>";
    }

    if (side && global.RNFLearnPath && RNFLearnPath.renderSidePanel) {
      side.innerHTML = RNFLearnPath.renderSidePanel(stats);
    }

    if (global.RNFFrogLogo) RNFFrogLogo.mount();
    if (main) bindSpeakButtons(main);
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

    document.title = t("flow.guidePageTitle");
  }

  global.RNFGuide = { init: init, GUIDES: GUIDES };
})(typeof window !== "undefined" ? window : this);
