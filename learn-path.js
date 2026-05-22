/**
 * Learn path UI — Rainy Night Frog
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

  var ACTIVE_UNIT_DEFAULT = {
    stage: 1,
    part: 4,
    topicKey: "flow.learnSectionTravel",
    banner: "moon",
    guideSection: 4,
  };

  var ACTIVE_UNIT_BY_COURSE = {
    zh: {
      stage: 1,
      part: 1,
      topicKey: "flow.learnUnitTopic2",
      banner: "moon",
      guideSection: 2,
    },
    ko: {
      stage: 1,
      part: 1,
      topicKey: "flow.learnUnitTopic2",
      banner: "moon",
      guideSection: 2,
    },
    ja: {
      stage: 1,
      part: 1,
      topicKey: "flow.learnUnitTopic2",
      banner: "moon",
      guideSection: 2,
    },
    en: {
      stage: 1,
      part: 1,
      topicKey: "flow.learnUnitTopic2",
      banner: "moon",
      guideSection: 2,
    },
  };

  function getActiveUnit() {
    var target = "en";
    try {
      target = sessionStorage.getItem("learn_target") || "en";
    } catch (e) {}
    return ACTIVE_UNIT_BY_COURSE[target] || ACTIVE_UNIT_DEFAULT;
  }

  /** @type {{ nodes?: object[], divider?: string, prop?: string, mascot?: string }[]} */
  var PATH_LAYOUT = [
    {
      nodes: [
        { type: "jump", jumpStyle: "blue", showTip: true, targetPart: 6 },
        { type: "star", state: "locked" },
        { type: "practice", state: "locked" },
        { type: "chest", state: "locked" },
        { type: "star", state: "locked" },
        { type: "trophy", state: "locked" },
      ],
      prop: "npc",
    },
    { divider: "flow.learnSectionFriends" },
    {
      nodes: [
        { type: "jump", jumpStyle: "pink", showTip: true },
        { type: "star", state: "locked" },
        { type: "star", state: "current", href: "lesson.html" },
      ],
    },
  ];

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function nodeIcon(type) {
    if (type === "chest") return "🎁";
    if (type === "trophy") return "🏆";
    if (type === "cat") return "🐱";
    if (type === "practice") return "🌊";
    if (type === "jump") return "⚡";
    return "✦";
  }

  function nodeTypeLabel(type) {
    var map = {
      star: "flow.pondStopLesson",
      practice: "flow.pondStopDrill",
      chest: "flow.pondStopChest",
      trophy: "flow.pondStopBoss",
      jump: "flow.pondStopRapid",
    };
    return t(map[type] || "flow.pondStopLesson");
  }

  function flattenPondStops() {
    var stops = [];
    PATH_LAYOUT.forEach(function (block) {
      if (block.divider) {
        stops.push({ kind: "divider", key: block.divider });
        return;
      }
      if (block.nodes) {
        block.nodes.forEach(function (n) {
          stops.push({ kind: "node", node: n, prop: block.prop, mascot: block.mascot });
        });
      }
    });
    return stops;
  }

  function renderPondDivider(key) {
    return (
      '<div class="lc-pond-signpost" role="separator">' +
      '<span class="lc-pond-signpost-pole"></span>' +
      '<span class="lc-pond-signpost-lbl">' +
      t(key) +
      "</span></div>"
    );
  }

  function renderPondJump(n) {
    var style = n.jumpStyle || "violet";
    var tipHtml =
      n.showTip !== false
        ? '<span class="lc-pond-jump-tip">' + t("flow.learnJump") + "</span>"
        : "";
    return (
      '<div class="lc-pond-stop lc-pond-stop--jump lc-pond-stop--' +
      style +
      '">' +
      tipHtml +
      '<button type="button" class="lc-pond-jump-btn" aria-label="' +
      t("flow.learnJump") +
      '" data-target-part="' +
      (n.targetPart || getActiveUnit().part + 1) +
      '">' +
      '<span class="lc-pond-stop-glow"></span>' +
      '<span class="lc-pond-stop-icon">' +
      nodeIcon("jump") +
      "</span>" +
      '<span class="lc-pond-stop-type">' +
      nodeTypeLabel("jump") +
      "</span></button></div>"
    );
  }

  function renderPondStop(n, index) {
    if (n.type === "jump") return renderPondJump(n);

    var state = n.state || "locked";
    var tag = n.href && state === "current" ? "a" : "div";
    var cls =
      "lc-pond-stop lc-pond-stop--" +
      n.type +
      " lc-pond-stop--" +
      state;
    var attrs =
      tag === "a"
        ? ' href="' + n.href + '" class="' + cls + '"'
        : ' class="' + cls + '"';

    var ribbon =
      state === "current" && n.href
        ? '<span class="lc-pond-ribbon">' + t("flow.learnStart") + "</span>"
        : "";
    var lock =
      state === "locked"
        ? '<span class="lc-pond-lock" aria-hidden="true">🔒</span>'
        : "";

    return (
      "<" +
      tag +
      attrs +
      ">" +
      ribbon +
      '<span class="lc-pond-stop-pad"></span>' +
      '<span class="lc-pond-stop-icon">' +
      nodeIcon(n.type) +
      "</span>" +
      '<span class="lc-pond-stop-type">' +
      nodeTypeLabel(n.type) +
      "</span>" +
      lock +
      "</" +
      tag +
      ">"
    );
  }

  function renderPondPals() {
    return (
      '<div class="lc-pond-pals" aria-hidden="true">' +
      '<div class="lc-pond-pal lc-pond-pal--firefly"></div>' +
      '<div class="lc-pond-pal lc-pond-pal--newt"></div>' +
      '<div class="lc-pond-pal lc-pond-pal--dragon" data-frog-logo></div>' +
      '<div class="lc-pond-pal lc-pond-pal--fish"></div></div>'
    );
  }

  function renderPondJourney() {
    var stops = flattenPondStops();
    var track = "";
    stops.forEach(function (item, i) {
      if (item.kind === "divider") {
        track += renderPondDivider(item.key);
      } else {
        track += renderPondStop(item.node, i);
      }
    });
    return (
      '<div class="lc-pond-scene">' +
      renderPondPals() +
      '<div class="lc-pond-scroll">' +
      '<div class="lc-pond-river">' +
      '<div class="lc-pond-river-line" aria-hidden="true"></div>' +
      '<div class="lc-pond-track">' +
      track +
      "</div></div></div>" +
      '<button type="button" class="lc-pond-scroll-hint" data-pond-scroll aria-label="Scroll">' +
      t("flow.pondScrollHint") +
      " →</button></div>"
    );
  }

  function renderChapterBanner() {
    var unit = getActiveUnit();
    var accent = unit.banner || "moon";
    return (
      '<header class="lc-pond-chapter lc-pond-chapter--' +
      accent +
      '">' +
      '<div class="lc-pond-chapter-meta">' +
      '<a class="lc-pond-chapter-back" href="languages.html">' +
      t("flow.learnStage", {
        stage: unit.stage,
        part: unit.part,
      }) +
      "</a>" +
      '<a class="lc-pond-chapter-guide" href="guide.html?section=' +
      (unit.guideSection || 1) +
      '">' +
      '<span aria-hidden="true">📖</span> ' +
      t("flow.learnGuide") +
      "</a></div>" +
      '<h1 class="lc-pond-chapter-title">' +
      t(unit.topicKey) +
      "</h1>" +
      '<p class="lc-pond-chapter-sub">' +
      t("flow.pondChapterSub") +
      "</p></header>"
    );
  }

  function getBoardUnitsLeft() {
    var done = global.LCApp && LCApp.getUnitsCompleted ? LCApp.getUnitsCompleted() : 0;
    var need = global.RNFLeaderboard && RNFLeaderboard.UNLOCK_UNITS
      ? RNFLeaderboard.UNLOCK_UNITS
      : 10;
    return Math.max(0, need - done);
  }

  function renderTopBar(stats) {
    return global.LCApp && LCApp.renderLearnStatsBar
      ? LCApp.renderLearnStatsBar(stats).replace(
          'class="lc-learn-stats"',
          'class="lc-learn-stats lc-pond-stats"'
        )
      : "";
  }

  function renderSidePanel(stats) {
    var dailyPct = stats.dailyGoal
      ? Math.min(100, Math.round((stats.dailyXp / stats.dailyGoal) * 100))
      : 0;
    var dailyCur = Math.min(stats.dailyXp, stats.dailyGoal);
    var dailyDone = dailyCur >= stats.dailyGoal;
    var boardLeft = getBoardUnitsLeft();

    return (
      '<div class="lc-panel-card lc-panel-super lc-learn-super-card lc-pond-widget">' +
      '<div class="lc-learn-super-inner">' +
      '<div class="lc-learn-super-copy">' +
      '<h3 class="lc-panel-title">' +
      t("flow.learnSuperTitle") +
      "</h3>" +
      '<p class="lc-panel-text">' +
      t("flow.learnSuperDesc") +
      "</p>" +
      '<a href="super.html" class="lc-panel-cta">' +
      t("flow.learnSuperCta") +
      "</a></div>" +
      '<div class="lc-learn-super-mascot" data-frog-logo aria-hidden="true"></div></div></div>' +
      '<div class="lc-panel-card lc-shop-board-card lc-pond-widget">' +
      "<h3 class=\"lc-panel-title\">" +
      t("flow.learnBoardTitle") +
      "</h3>" +
      '<div class="lc-shop-board-row">' +
      '<span class="lc-shop-board-shield" aria-hidden="true">🛡️</span>' +
      '<p class="lc-panel-text">' +
      t("flow.learnBoardDesc", { n: boardLeft }) +
      "</p></div></div>" +
      '<div class="lc-panel-card lc-panel-daily lc-pond-widget">' +
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
      "</div></div>"
    );
  }

  var jumpOverlayEl = null;
  var jumpTargetPart = null;

  function ensureJumpOverlay() {
    if (jumpOverlayEl) return jumpOverlayEl;
    var el = document.createElement("div");
    el.className = "lc-jump-overlay";
    el.hidden = true;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "jumpTestTitle");
    el.innerHTML =
      '<div class="lc-jump-modal">' +
      '<div class="lc-jump-hero">' +
      '<div class="lc-jump-mascot-wrap">' +
      '<div class="lc-jump-coins" aria-hidden="true"><span>🪙</span><span>🪙</span><span>🪙</span></div>' +
      '<div class="lc-jump-mascot" data-frog-logo></div></div>' +
      '<div class="lc-jump-platform" aria-hidden="true"><span class="lc-jump-chevron">▼</span></div>' +
      "</div>" +
      '<p class="lc-jump-msg" id="jumpTestTitle"></p>' +
      '<div class="lc-jump-actions">' +
      '<button type="button" class="lc-jump-later" data-jump-later></button>' +
      '<button type="button" class="lc-jump-start" data-jump-start></button>' +
      "</div></div>";
    document.body.appendChild(el);
    jumpOverlayEl = el;

    el.querySelector("[data-jump-later]").addEventListener("click", closeJumpModal);
    el.querySelector("[data-jump-start]").addEventListener("click", startJumpTest);
    el.addEventListener("click", function (e) {
      if (e.target === el) closeJumpModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && jumpOverlayEl && !jumpOverlayEl.hidden) {
        closeJumpModal();
      }
    });
    return el;
  }

  function refreshJumpModalCopy() {
    if (!jumpOverlayEl || jumpOverlayEl.hidden) return;
    var part = jumpTargetPart || getActiveUnit().part + 1;
    jumpOverlayEl.querySelector(".lc-jump-msg").textContent = t("flow.jumpTestPrompt", {
      n: part,
    });
    jumpOverlayEl.querySelector("[data-jump-later]").textContent = t("flow.jumpTestLater");
    jumpOverlayEl.querySelector("[data-jump-start]").textContent = t("flow.jumpTestStart");
  }

  function openJumpModal(targetPart) {
    jumpTargetPart = targetPart;
    var overlay = ensureJumpOverlay();
    refreshJumpModalCopy();
    overlay.hidden = false;
    document.body.classList.add("lc-jump-open");
    if (global.RNFFrogLogo) RNFFrogLogo.mount(overlay);
    overlay.querySelector("[data-jump-start]").focus();
  }

  function closeJumpModal() {
    if (!jumpOverlayEl) return;
    jumpOverlayEl.hidden = true;
    document.body.classList.remove("lc-jump-open");
  }

  function startJumpTest() {
    var part = jumpTargetPart || getActiveUnit().part + 1;
    try {
      sessionStorage.setItem("rnf_jump_test_part", String(part));
    } catch (e) {}
    location.href = "lesson.html?mode=jump&part=" + encodeURIComponent(part);
  }

  function bindJumpButtons(root) {
    if (root._jumpClickBound) return;
    root._jumpClickBound = true;
    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".lc-pond-jump-btn");
      if (!btn || !root.contains(btn)) return;
      var part = parseInt(btn.getAttribute("data-target-part") || "", 10);
      if (!part || isNaN(part)) part = getActiveUnit().part + 1;
      openJumpModal(part);
    });
  }

  function bindPondScroll(root) {
    var btn = root.querySelector("[data-pond-scroll]");
    var scroll = root.querySelector(".lc-pond-scroll");
    if (!btn || !scroll) return;
    btn.addEventListener("click", function () {
      scroll.scrollBy({ left: 220, behavior: "smooth" });
    });
  }

  function init() {
    var target = global.LCApp ? LCApp.getLearnTarget() : "en";
    var stats = global.LCApp
      ? LCApp.getLearnStats()
      : {
          streak: 1,
          gems: 505,
          hearts: 5,
          dailyXp: 0,
          dailyGoal: 10,
          target: target,
        };

    var pathCol = document.getElementById("pathCol");
    var sidePanel = document.getElementById("sidePanel");
    var topbar = document.getElementById("pondTopbar");
    if (!pathCol) return;

    if (topbar) topbar.innerHTML = renderTopBar(stats);

    pathCol.innerHTML = renderChapterBanner() + renderPondJourney();

    if (sidePanel) sidePanel.innerHTML = renderSidePanel(stats);

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    bindJumpButtons(pathCol);
    bindPondScroll(pathCol);

    var currentStop = pathCol.querySelector(".lc-pond-stop--current");
    var pondScroll = pathCol.querySelector(".lc-pond-scroll");
    if (currentStop && pondScroll) {
      setTimeout(function () {
        currentStop.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      }, 120);
    }

    if (global.LCApp && LCApp.initCoursePicker) LCApp.initCoursePicker();
    if (global.LCApp && LCApp.initStreakPicker) LCApp.initStreakPicker();
    if (global.LCApp && LCApp.initGemsPicker) LCApp.initGemsPicker();
    if (global.LCApp && LCApp.initHeartsPicker) LCApp.initHeartsPicker();

    var langLbl = document.querySelector("[data-learn-lang-label]");
    if (langLbl) {
      langLbl.textContent =
        (LANG_FLAGS[target] || "") +
        " " +
        t(
          target === "zh"
            ? "flow.courseZh"
            : COURSE_KEYS[target] || "flow.courseEn"
        );
    }
  }

  global.RNFLearnPath = {
    init: init,
    renderSidePanel: renderSidePanel,
    getBoardUnitsLeft: getBoardUnitsLeft,
    openJumpModal: openJumpModal,
    closeJumpModal: closeJumpModal,
    refreshJumpModalCopy: refreshJumpModalCopy,
  };
})(typeof window !== "undefined" ? window : this);
