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

  function getActiveUnit() {
    if (global.RNFPathProgress && RNFPathProgress.getActiveUnit) {
      return RNFPathProgress.getActiveUnit();
    }
    return {
      stage: 1,
      part: 1,
      topicKey: "flow.pathStage1Topic",
      subKey: "flow.pathStage1Sub",
      banner: "moon",
      guideSection: 1,
      tier: 1,
      tierLabelKey: "flow.pathTier1",
      sceneClass: "lc-pond-scene--s1",
    };
  }

  function getPathLayout() {
    if (global.RNFPathProgress && RNFPathProgress.buildPathLayout) {
      return RNFPathProgress.buildPathLayout();
    }
    return [];
  }

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function nodeIcon(type) {
    if (type === "chest") return "🎁";
    if (type === "trophy") return "🏆";
    if (type === "cat") return "🐱";
    if (type === "practice") return "🌊";
    if (type === "jump") return "⚡";
    if (type === "listen") return "🎧";
    if (type === "match") return "🔗";
    if (type === "quiz") return "📝";
    if (type === "story") return "📖";
    if (type === "bonus") return "✨";
    if (type === "raid") return "🐉";
    if (type === "flash") return "⚡️";
    if (type === "vocab") return "📚";
    return "✦";
  }

  function nodeTypeLabel(type) {
    var map = {
      star: "flow.pondStopLesson",
      practice: "flow.pondStopDrill",
      chest: "flow.pondStopChest",
      trophy: "flow.pondStopBoss",
      jump: "flow.pondStopRapid",
      listen: "flow.pondStopListen",
      match: "flow.pondStopMatch",
      quiz: "flow.pondStopQuiz",
      story: "flow.pondStopStory",
      bonus: "flow.pondStopBonus",
      raid: "flow.pondStopRaid",
      flash: "flow.pondStopFlash",
      vocab: "flow.pondStopVocab",
    };
    return t(map[type] || "flow.pondStopLesson");
  }

  function flattenPondStops() {
    var stops = [];
    getPathLayout().forEach(function (block) {
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

  function gemBadgeHtml(node) {
    if (node.gemHint === "jump") {
      return (
        '<span class="lc-pond-gem-badge lc-pond-gem-badge--jump">+' +
        (global.RNFPathProgress ? RNFPathProgress.GEM_JUMP_WIN : 10) +
        " 💎</span>"
      );
    }
    if (node.gemReward && node.gemReward > 0) {
      var gemCls =
        node.gemHint === "challenge" || node.boss
          ? " lc-pond-gem-badge--boss"
          : node.gemHint === "chest"
            ? " lc-pond-gem-badge--chest"
            : node.gemHint === "bonus"
              ? " lc-pond-gem-badge--bonus"
              : "";
      return (
        '<span class="lc-pond-gem-badge' +
        gemCls +
        '">+' +
        node.gemReward +
        " 💎</span>"
      );
    }
    if (node.gemHint === "challenge") {
      return (
        '<span class="lc-pond-gem-badge lc-pond-gem-badge--boss">+' +
        (global.RNFPathProgress ? RNFPathProgress.GEM_CHALLENGE : 3) +
        " 💎</span>"
      );
    }
    if (node.gemHint === "chest") {
      return (
        '<span class="lc-pond-gem-badge lc-pond-gem-badge--chest">+' +
        (global.RNFPathProgress ? RNFPathProgress.GEM_CHEST : 4) +
        " 💎</span>"
      );
    }
    if (node.gemHint === "bonus") {
      return '<span class="lc-pond-gem-badge lc-pond-gem-badge--bonus">+5 💎</span>';
    }
    if (node.xpHint || node.xpReward) {
      return (
        '<span class="lc-pond-xp-badge">+' +
        (node.xpReward || node.xpHint) +
        " XP</span>"
      );
    }
    return "";
  }

  function renderDifficultyStars(node) {
    var d = node.difficulty;
    if (d == null || d < 1) return "";
    var stars = Math.min(5, 1 + Math.floor(d / 3));
    var html = '<span class="lc-pond-diff" aria-hidden="true">';
    for (var i = 0; i < stars; i++) html += "★";
    return html + "</span>";
  }

  function playTagHtml(node) {
    if (!node.playKey) return "";
    return '<span class="lc-pond-play-tag">' + t(node.playKey) + "</span>";
  }

  function renderLevelBadge(n) {
    if (!n.levelNum) return "";
    var tierKey = n.tierLabelKey || "flow.pathTierBasic";
    var tierCls =
      n.tierRank >= 3
        ? " lc-pond-level--elite"
        : n.tierRank >= 2
          ? " lc-pond-level--adv"
          : "";
    return (
      '<span class="lc-pond-level' +
      tierCls +
      '">' +
      '<span class="lc-pond-level-num">' +
      n.levelNum +
      "</span>" +
      '<span class="lc-pond-level-lbl">' +
      t("flow.pathLevelNum", { n: n.levelNum }) +
      "</span>" +
      '<span class="lc-pond-level-tier">' +
      t(tierKey) +
      "</span></span>"
    );
  }

  function renderCurrentRibbon(n, state) {
    if (state !== "current" || !n.href || !n.levelNum) return "";
    var html =
      '<span class="lc-pond-ribbon lc-pond-ribbon--now">' +
      t("flow.pathLevelNow", { n: n.levelNum }) +
      " · " +
      t("flow.learnStart") +
      "</span>";
    if (n.nextIsAdvanced) {
      html +=
        '<span class="lc-pond-next-adv">' +
        t("flow.pathNextAdvanced", { n: n.nextLevelNum }) +
        "</span>";
    } else if (n.nextLevelNum) {
      html +=
        '<span class="lc-pond-next-hint">' +
        t("flow.pathNextLevel", { n: n.nextLevelNum }) +
        "</span>";
    }
    return html;
  }

  function renderPathProgressStrip() {
    if (!global.RNFPathProgress || !RNFPathProgress.getPathLevelSummary) {
      return "";
    }
    var sum = RNFPathProgress.getPathLevelSummary();
    var pct = sum.total
      ? Math.round((sum.current / sum.total) * 100)
      : 0;
    return (
      '<div class="lc-pond-path-progress" role="status">' +
      '<span class="lc-pond-path-progress-lbl">' +
      t("flow.pathProgressLabel", {
        cur: sum.current,
        total: sum.total,
      }) +
      "</span>" +
      '<div class="lc-pond-path-progress-bar" aria-hidden="true">' +
      '<div class="lc-pond-path-progress-fill" style="width:' +
      pct +
      '%"></div></div></div>'
    );
  }

  function renderPondJump(n) {
    var style = n.jumpStyle || "violet";
    var tipHtml =
      n.showTip !== false
        ? '<span class="lc-pond-jump-tip">' + t("flow.learnJump") + "</span>"
        : "";
    var riskHtml =
      '<span class="lc-pond-jump-risk" title="' +
      t("flow.pathJumpRisk", {
        win: global.RNFPathProgress ? RNFPathProgress.GEM_JUMP_WIN : 10,
        lose: global.RNFPathProgress ? RNFPathProgress.GEM_JUMP_FAIL : 3,
      }) +
      '">' +
      "<span>+" +
      (global.RNFPathProgress ? RNFPathProgress.GEM_JUMP_WIN : 10) +
      "💎</span>" +
      "<span>−" +
      (global.RNFPathProgress ? RNFPathProgress.GEM_JUMP_FAIL : 3) +
      "💎</span></span>";
    return (
      '<div class="lc-pond-stop lc-pond-stop--jump lc-pond-stop--' +
      style +
      (n.state === "done" ? " lc-pond-stop--done" : "") +
      '">' +
      tipHtml +
      gemBadgeHtml(n) +
      riskHtml +
      '<button type="button" class="lc-pond-jump-btn" aria-label="' +
      t("flow.learnJump") +
      '" data-target-part="' +
      (n.targetPart || getActiveUnit().part + 1) +
      '" data-target-stage="' +
      (n.targetStage || getActiveUnit().stage) +
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

  function renderPondStop(n, index, onLily) {
    if (n.type === "jump") return renderPondJump(n);

    var state = n.state || "locked";
    var tag = n.href && state === "current" ? "a" : "div";
    var cls =
      "lc-pond-stop lc-pond-stop--" +
      n.type +
      " lc-pond-stop--" +
      state +
      (onLily ? " lc-pond-stop--lily" : "") +
      (n.boss || n.type === "trophy" || n.type === "raid"
        ? " lc-pond-stop--boss"
        : "");
    var ariaLabel =
      n.levelNum && n.tierLabelKey
        ? t("flow.pathLevelNum", { n: n.levelNum }) +
          " · " +
          t(n.tierLabelKey) +
          " · " +
          nodeTypeLabel(n.type)
        : nodeTypeLabel(n.type);
    var attrs =
      tag === "a"
        ? ' href="' +
          n.href +
          '" class="' +
          cls +
          '" aria-label="' +
          ariaLabel +
          '"'
        : ' class="' + cls + '" aria-label="' + ariaLabel + '"';

    var ribbon =
      state === "current" && n.href
        ? '<span class="lc-pond-ribbon">' + t("flow.learnStart") + "</span>"
        : "";
    var lock =
      state === "locked"
        ? '<span class="lc-pond-lock" aria-hidden="true">🔒</span>'
        : "";
    var doneMark =
      state === "done"
        ? '<span class="lc-pond-done-mark" aria-hidden="true">✓</span>'
        : "";

    return (
      "<" +
      tag +
      attrs +
      ">" +
      ribbon +
      renderLevelBadge(n) +
      gemBadgeHtml(n) +
      renderDifficultyStars(n) +
      '<span class="lc-pond-stop-pad"></span>' +
      '<span class="lc-pond-stop-icon">' +
      nodeIcon(n.type) +
      "</span>" +
      '<span class="lc-pond-stop-type">' +
      nodeTypeLabel(n.type) +
      "</span>" +
      playTagHtml(n) +
      doneMark +
      lock +
      "</" +
      tag +
      ">"
    );
  }

  function renderPondPals() {
    var animals =
      global.RNFPathProgress && RNFPathProgress.renderPathAnimals
        ? RNFPathProgress.renderPathAnimals()
        : "";
    return (
      '<div class="lc-pond-pals" aria-hidden="true">' +
      animals +
      '<span class="lc-pond-float-reward lc-pond-float-reward--gem" style="left:12%;top:42%">+💎</span>' +
      '<span class="lc-pond-float-reward lc-pond-float-reward--xp" style="left:78%;top:38%">+XP</span>' +
      '<span class="lc-pond-float-reward lc-pond-float-reward--gem" style="left:45%;top:72%">+💎</span>' +
      '<span class="lc-pond-float-reward lc-pond-float-reward--xp" style="left:88%;top:65%">+XP</span>' +
      '<span class="lc-pond-lily-deco" style="left:8%;top:55%"></span>' +
      '<span class="lc-pond-lily-deco lc-pond-lily-deco--pink" style="left:62%;top:48%"></span>' +
      '<span class="lc-pond-lily-deco lc-pond-lily-deco--gold" style="left:35%;top:78%"></span>' +
      '<div class="lc-pond-pal lc-pond-pal--firefly"></div>' +
      '<div class="lc-pond-pal lc-pond-pal--newt"></div>' +
      '<div class="lc-pond-pal lc-pond-pal--dragon" data-frog-logo></div>' +
      '<div class="lc-pond-pal lc-pond-pal--fish"></div></div>'
    );
  }

  function renderPondZoneTitle(block) {
    if (!block.zoneKey) return "";
    var rangeHtml = "";
    if (block.levelFrom && block.levelTo) {
      rangeHtml =
        '<span class="lc-pond-zone-range">' +
        t("flow.pathZoneLevels", {
          from: block.levelFrom,
          to: block.levelTo,
        }) +
        "</span>";
    }
    var tierHtml = block.zoneTierKey
      ? '<span class="lc-pond-zone-tier">' + t(block.zoneTierKey) + "</span>"
      : "";
    return (
      '<div class="lc-pond-zone-head">' +
      '<span class="lc-pond-zone-badge">' +
      (block.mascot || "✦") +
      "</span>" +
      '<div class="lc-pond-zone-head-text">' +
      '<span class="lc-pond-zone-title">' +
      t(block.zoneKey) +
      "</span>" +
      rangeHtml +
      tierHtml +
      "</div></div>"
    );
  }

  function renderPondRowZone(block) {
    var row = "";
    block.nodes.forEach(function (n, i) {
      row += renderPondStop(n, i);
    });
    return (
      '<div class="lc-pond-zone ' +
      (block.zone || "") +
      '">' +
      renderPondZoneTitle(block) +
      '<div class="lc-pond-track-row">' +
      row +
      "</div></div>"
    );
  }

  function renderPondSnakeZone(block) {
    var nodes = block.nodes || [];
    var rows = block.rows || [5, 5, 5];
    var idx = 0;
    var rowsHtml = "";
    for (var r = 0; r < rows.length; r++) {
      var count = rows[r];
      var rtl = r % 2 === 1;
      var rowNodes = "";
      for (var c = 0; c < count && idx < nodes.length; c++, idx++) {
        rowNodes += renderPondStop(nodes[idx], idx, true);
      }
      rowsHtml +=
        (r > 0
          ? '<div class="lc-pond-snake-turn" aria-hidden="true"><span></span></div>'
          : "") +
        '<div class="lc-pond-snake-row' +
        (rtl ? " lc-pond-snake-row--rtl" : "") +
        '">' +
        rowNodes +
        "</div>";
    }
    return (
      '<div class="lc-pond-lake-wrap">' +
      '<div class="lc-pond-descent" aria-hidden="true">' +
      '<span class="lc-pond-descent-line"></span>' +
      '<span class="lc-pond-descent-label">' +
      t("flow.pondDescent") +
      "</span></div>" +
      '<div class="lc-pond-zone lc-pond-zone--lake ' +
      (block.zone || "") +
      '">' +
      '<div class="lc-pond-lake-bg" aria-hidden="true"></div>' +
      '<div class="lc-pond-lake-shimmer" aria-hidden="true"></div>' +
      renderPondZoneTitle(block) +
      '<div class="lc-pond-snake">' +
      rowsHtml +
      "</div>" +
      '<p class="lc-pond-lake-hint">' +
      t("flow.pondLakeHint") +
      "</p></div></div>"
    );
  }

  function renderPondJourney() {
    var layout = getPathLayout();
    var skyTrack = "";
    var lakeHtml = "";
    layout.forEach(function (block) {
      if (block.divider) {
        skyTrack += renderPondDivider(block.divider);
        return;
      }
      if (!block.nodes) return;
      if (block.layout === "snake") {
        lakeHtml = renderPondSnakeZone(block);
        return;
      }
      skyTrack += renderPondRowZone(block);
    });
    var unit = getActiveUnit();
    return (
      '<div class="lc-pond-scene lc-pond-scene--vivid lc-pond-scene--filled ' +
      (unit.sceneClass || "") +
      '">' +
      '<div class="lc-pond-scene-bg" aria-hidden="true"></div>' +
      '<div class="lc-pond-scene-aurora" aria-hidden="true"></div>' +
      renderPondPals() +
      '<div class="lc-pond-scroll lc-pond-scroll--full">' +
      renderPathProgressStrip() +
      '<div class="lc-pond-sky-path">' +
      '<div class="lc-pond-river">' +
      '<div class="lc-pond-river-line" aria-hidden="true"></div>' +
      '<div class="lc-pond-track lc-pond-track--wide">' +
      skyTrack +
      "</div></div></div>" +
      lakeHtml +
      "</div>" +
      '<button type="button" class="lc-pond-scroll-hint" data-pond-scroll aria-label="Scroll">' +
      t("flow.pondScrollHint") +
      " →</button></div>"
    );
  }

  var ISLAND_CHEER_KEYS = [
    "flow.islandCheer1",
    "flow.islandCheer2",
    "flow.islandCheer3",
    "flow.islandCheer4",
    "flow.islandCheer5",
    "flow.islandCheer6",
    "flow.islandCheer7",
    "flow.islandCheer8",
    "flow.islandCheer9",
    "flow.islandCheer10",
  ];

  var ISLAND_TIP_KEYS = [
    "flow.islandTip1",
    "flow.islandTip2",
    "flow.islandTip3",
    "flow.islandTip4",
    "flow.islandTip5",
    "flow.islandTip6",
  ];

  var ISLAND_BUDDIES = [
    { flag: "🇯🇵", skin: "👧", nameKey: "flow.buddyJp" },
    { flag: "🇧🇷", skin: "👦", nameKey: "flow.buddyBr" },
    { flag: "🇰🇪", skin: "👧", nameKey: "flow.buddyKe" },
    { flag: "🇫🇷", skin: "👦", nameKey: "flow.buddyFr" },
    { flag: "🇮🇳", skin: "👧", nameKey: "flow.buddyIn" },
    { flag: "🇺🇸", skin: "👦", nameKey: "flow.buddyUs" },
    { flag: "🇪🇬", skin: "👧", nameKey: "flow.buddyEg" },
    { flag: "🇲🇽", skin: "👦", nameKey: "flow.buddyMx" },
  ];

  var cheerRotateTimer = null;

  function renderChapterBuddies() {
    var items = "";
    ISLAND_BUDDIES.forEach(function (b, i) {
      items +=
        '<div class="lc-pond-buddy" style="--buddy-i:' +
        i +
        '" title="' +
        t(b.nameKey) +
        '">' +
        '<span class="lc-pond-buddy-flag" aria-hidden="true">' +
        b.flag +
        "</span>" +
        '<span class="lc-pond-buddy-face" aria-hidden="true">' +
        b.skin +
        "</span>" +
        '<span class="lc-pond-buddy-name">' +
        t(b.nameKey) +
        "</span></div>";
    });
    return (
      '<div class="lc-pond-buddies lc-pond-buddies--strip" aria-label="' +
      t("flow.islandBuddiesTitle") +
      '">' +
      '<p class="lc-pond-buddies-kicker">' +
      t("flow.islandBuddiesTitle") +
      "</p>" +
      '<div class="lc-pond-buddies-row">' +
      items +
      "</div></div>"
    );
  }

  function renderChapterTips() {
    var chips = "";
    ISLAND_TIP_KEYS.forEach(function (key, i) {
      chips +=
        '<span class="lc-pond-tip-chip' +
        (i === 0 ? " lc-pond-tip-chip--active" : "") +
        '" data-tip-index="' +
        i +
        '">' +
        t(key) +
        "</span>";
    });
    return (
      '<div class="lc-pond-tips" role="region" aria-live="polite">' +
      '<span class="lc-pond-tips-icon" aria-hidden="true">💡</span>' +
      '<div class="lc-pond-tips-track">' +
      chips +
      "</div>" +
      '<a class="lc-pond-tips-shop" href="shop.html">' +
      t("flow.islandTipShop") +
      "</a></div>"
    );
  }

  function renderCheerTitle(initialIndex) {
    var idx = initialIndex || 0;
    var lines = "";
    ISLAND_CHEER_KEYS.forEach(function (key, i) {
      lines +=
        '<span class="lc-pond-cheer-line' +
        (i === idx ? " lc-pond-cheer-line--active" : "") +
        '" data-cheer-index="' +
        i +
        '">' +
        t(key) +
        "</span>";
    });
    return (
      '<h1 class="lc-pond-chapter-title lc-pond-chapter-title--cheer" data-cheer-rotate>' +
      lines +
      "</h1>"
    );
  }

  function bindCheerRotation(root) {
    if (cheerRotateTimer) {
      clearInterval(cheerRotateTimer);
      cheerRotateTimer = null;
    }
    var wrap = root.querySelector("[data-cheer-rotate]");
    if (!wrap) return;
    var lines = wrap.querySelectorAll(".lc-pond-cheer-line");
    if (!lines.length) return;
    var cur = 0;
    cheerRotateTimer = setInterval(function () {
      lines[cur].classList.remove("lc-pond-cheer-line--active");
      cur = (cur + 1) % lines.length;
      lines[cur].classList.add("lc-pond-cheer-line--active");
    }, 4200);
  }

  function bindTipsRotation(root) {
    var chips = root.querySelectorAll(".lc-pond-tip-chip");
    if (!chips.length) return;
    var cur = 0;
    setInterval(function () {
      chips[cur].classList.remove("lc-pond-tip-chip--active");
      cur = (cur + 1) % chips.length;
      chips[cur].classList.add("lc-pond-tip-chip--active");
    }, 5500);
  }

  var ISLAND_PROFESSIONS = [
    {
      minLevel: 1,
      icon: "🌱",
      nameKey: "flow.professionApprentice",
      descKey: "flow.professionApprenticeDesc",
    },
    {
      minLevel: 3,
      icon: "🧭",
      nameKey: "flow.professionScout",
      descKey: "flow.professionScoutDesc",
    },
    {
      minLevel: 6,
      icon: "⚔️",
      nameKey: "flow.professionKnight",
      descKey: "flow.professionKnightDesc",
    },
    {
      minLevel: 10,
      icon: "🔮",
      nameKey: "flow.professionSage",
      descKey: "flow.professionSageDesc",
    },
    {
      minLevel: 15,
      icon: "👑",
      nameKey: "flow.professionLegend",
      descKey: "flow.professionLegendDesc",
    },
  ];

  function getProfessionForLevel(level) {
    var pick = ISLAND_PROFESSIONS[0];
    for (var i = 0; i < ISLAND_PROFESSIONS.length; i++) {
      if (level >= ISLAND_PROFESSIONS[i].minLevel) pick = ISLAND_PROFESSIONS[i];
    }
    return pick;
  }

  function renderIslandHud() {
    if (!global.RNFIslandProgress || !RNFIslandProgress.getSummary) return "";
    var sum = RNFIslandProgress.getSummary();
    var xpPer = global.RNFIslandProgress.XP_PER_LEVEL || 80;
    var inLevel = sum.stats.xpEarned % xpPer;
    var pct = Math.round((inLevel / xpPer) * 100);
    var prof = getProfessionForLevel(sum.level);
    return (
      '<div class="lc-island-hud" role="status">' +
      '<div class="lc-island-hud-row">' +
      '<div class="lc-island-hud-identity">' +
      '<span class="lc-island-hud-prof-icon" aria-hidden="true">' +
      prof.icon +
      "</span>" +
      '<div class="lc-island-hud-titles">' +
      '<span class="lc-island-hud-lv">' +
      t("flow.islandHudLevel", { n: sum.level }) +
      "</span>" +
      '<span class="lc-island-hud-prof">' +
      t(prof.nameKey) +
      "</span></div></div>" +
      '<p class="lc-island-hud-prof-desc">' +
      t(prof.descKey) +
      "</p></div>" +
      '<div class="lc-island-hud-bar" aria-hidden="true">' +
      '<div class="lc-island-hud-fill" style="width:' +
      pct +
      '%"></div></div>' +
      '<p class="lc-island-hud-meta">' +
      t("flow.islandHudXp", { n: sum.xpToNext }) +
      " · " +
      t("flow.islandHudNodes", { n: sum.stats.nodesCleared }) +
      " · " +
      t("flow.islandHudBosses", { n: sum.stats.bossesBeat }) +
      (sum.stats.raidsBeat
        ? " · " + t("flow.islandHudRaids", { n: sum.stats.raidsBeat })
        : "") +
      "</p></div>"
    );
  }

  function renderChapterBanner() {
    var unit = getActiveUnit();
    var accent = unit.banner || "moon";
    var tierLbl = unit.tierLabelKey ? t(unit.tierLabelKey) : "";
    return (
      '<header class="lc-pond-chapter lc-pond-chapter--compact lc-pond-chapter--' +
      accent +
      '">' +
      renderIslandHud() +
      '<div class="lc-pond-chapter-meta">' +
      '<a class="lc-pond-chapter-back" href="languages.html">' +
      t("flow.learnStage", {
        stage: unit.stage,
        part: unit.part,
      }) +
      "</a>" +
      '<span class="lc-pond-tier-pill">' +
      tierLbl +
      "</span>" +
      '<a class="lc-pond-chapter-guide" href="guide.html?section=' +
      (unit.guideSection || 1) +
      '">' +
      '<span aria-hidden="true">📖</span> ' +
      t("flow.learnGuide") +
      "</a></div>" +
      '<div class="lc-pond-chapter-headline">' +
      '<div class="lc-pond-chapter-headline-main">' +
      renderCheerTitle(0) +
      '<p class="lc-pond-chapter-topic">' +
      '<span class="lc-pond-chapter-topic-lbl">' +
      t("flow.islandTopicLabel") +
      "</span> " +
      t(unit.topicKey) +
      "</p>" +
      '<p class="lc-pond-chapter-sub">' +
      t(unit.subKey || "flow.pondChapterSub") +
      "</p></div></div>" +
      renderChapterBuddies() +
      renderChapterTips() +
      "</header>"
    );
  }

  function getBoardUnitsLeft() {
    if (
      global.RNFIslandProgress &&
      RNFIslandProgress.canShowLeaderboard &&
      RNFIslandProgress.canShowLeaderboard()
    ) {
      return 0;
    }
    if (global.RNFIslandProgress && RNFIslandProgress.loadStats) {
      var cleared = RNFIslandProgress.loadStats().nodesCleared || 0;
      var need =
        global.RNFIslandProgress.LB_UNLOCK_NODES != null
          ? RNFIslandProgress.LB_UNLOCK_NODES
          : 3;
      return Math.max(0, need - cleared);
    }
    var done = global.LCApp && LCApp.getUnitsCompleted ? LCApp.getUnitsCompleted() : 0;
    var need = global.RNFLeaderboard && RNFLeaderboard.UNLOCK_UNITS
      ? RNFLeaderboard.UNLOCK_UNITS
      : 10;
    return Math.max(0, need - done);
  }

  function consumeLessonFinishPayload() {
    try {
      var raw = sessionStorage.getItem("rnf_lesson_just_finished");
      if (!raw) return null;
      sessionStorage.removeItem("rnf_lesson_just_finished");
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function hasUserProfile() {
    if (global.RNFPlayerAuth && RNFPlayerAuth.isLoggedIn) {
      return RNFPlayerAuth.isLoggedIn();
    }
    try {
      return localStorage.getItem("rnf_profile_created") === "1";
    } catch (e) {
      return false;
    }
  }

  function renderLessonRecapWidget(data) {
    if (!data) return "";
    var total = data.total || data.answered || 10;
    return (
      '<div class="lc-panel-card lc-pond-widget lc-pond-widget--recap">' +
      '<p class="lc-pond-recap-kicker">✨ ' +
      t("flow.lessonDoneRecapTitle") +
      "</p>" +
      '<p class="lc-pond-recap-stat">' +
      t("flow.lessonDoneRecapSub", {
        correct: data.correct || 0,
        total: total,
        acc: data.acc != null ? data.acc : 0,
        xp: data.xp || 0,
      }) +
      "</p>" +
      '<a class="lc-panel-cta lc-pond-recap-cta" href="lesson.html">' +
      t("flow.lessonDoneRecapCta") +
      "</a></div>"
    );
  }

  function renderHubExploreGrid() {
    var links = [
      { href: "shop.html", icon: "💎", key: "flow.hubQuickShop" },
      { href: "quests.html", icon: "🎁", key: "flow.hubQuickQuests" },
      { href: "profile.html", icon: "🐸", key: "flow.hubQuickProfile" },
      { href: "leaderboard.html", icon: "🛡️", key: "flow.hubQuickLeaderboard" },
      { href: "guide.html", icon: "📖", key: "flow.hubQuickGuide" },
      { href: "languages.html", icon: "🌍", key: "flow.wantLearn" },
    ];
    var items = "";
    links.forEach(function (lnk) {
      items +=
        '<a class="lc-hub-quick" href="' +
        lnk.href +
        '"><span class="lc-hub-quick-icon" aria-hidden="true">' +
        lnk.icon +
        '</span><span class="lc-hub-quick-lbl">' +
        t(lnk.key) +
        "</span></a>";
    });
    return (
      '<div class="lc-panel-card lc-pond-widget lc-pond-widget--hub">' +
      '<h3 class="lc-panel-title">' +
      t("flow.hubExploreTitle") +
      "</h3>" +
      '<div class="lc-hub-quick-grid">' +
      items +
      "</div></div>"
    );
  }

  function renderHubProfileCard() {
    if (hasUserProfile()) {
      var user =
        global.RNFPlayerAuth && RNFPlayerAuth.getCurrentUser
          ? RNFPlayerAuth.getCurrentUser()
          : null;
      var label = user
        ? user.name || user.email || t("flow.hubProfileLoggedIn")
        : t("flow.hubProfileLoggedIn");
      return (
        '<div class="lc-panel-card lc-pond-widget lc-pond-widget--profile lc-pond-widget--logged-in">' +
        '<h3 class="lc-panel-title">' +
        t("flow.hubProfileLoggedInTitle") +
        "</h3>" +
        '<p class="lc-panel-text">' +
        t("flow.hubProfileLoggedInDesc", { name: label }) +
        "</p>" +
        '<div class="lc-hub-profile-actions">' +
        '<a class="lc-panel-link" href="profile.html">' +
        t("flow.hubQuickProfile") +
        "</a>" +
        '<button type="button" class="lc-panel-link lc-hub-logout" data-pond-logout">' +
        t("flow.moreLogout") +
        "</button></div></div>"
      );
    }
    return (
      '<div class="lc-panel-card lc-pond-widget lc-pond-widget--profile">' +
      '<h3 class="lc-panel-title">' +
      t("flow.hubProfileTitle") +
      "</h3>" +
      '<p class="lc-panel-text">' +
      t("flow.hubProfileDesc") +
      "</p>" +
      '<div class="lc-hub-profile-actions">' +
      '<a class="lc-panel-cta" href="auth.html?mode=register&return=learn.html">' +
      t("flow.hubProfileCta") +
      "</a>" +
      '<a class="lc-panel-link lc-hub-profile-login" href="auth.html?mode=login&return=learn.html">' +
      t("flow.hubProfileLogin") +
      "</a></div></div>"
    );
  }

  function renderTopBar(stats) {
    return global.LCApp && LCApp.renderLearnStatsBar
      ? LCApp.renderLearnStatsBar(stats).replace(
          'class="lc-learn-stats"',
          'class="lc-learn-stats lc-learn-top-stats"'
        )
      : "";
  }

  function getCheckinQuestStatus() {
    if (!global.RNFQuestSystem || !RNFQuestSystem.getSummary) return null;
    var summary = RNFQuestSystem.getSummary();
    for (var i = 0; i < summary.quests.length; i++) {
      if (summary.quests[i].id === "checkin") return summary.quests[i];
    }
    return null;
  }

  function renderDailyCheckinBlock() {
    var q = getCheckinQuestStatus();
    if (!q) return "";
    var action = "";
    if (!q.done) {
      action =
        '<button type="button" class="lc-pond-checkin-btn" data-pond-checkin>📅 ' +
        t("flow.questCheckinBtn") +
        "</button>";
    } else if (q.canClaim) {
      action =
        '<button type="button" class="lc-pond-checkin-btn lc-pond-checkin-btn--claim" data-pond-claim-checkin>🎁 ' +
        t("flow.questClaim") +
        " +10 💎</button>";
    } else {
      action =
        '<span class="lc-pond-checkin-done">✓ ' +
        t("flow.questClaimed") +
        "</span>";
    }
    return (
      '<div class="lc-pond-checkin">' +
      '<p class="lc-pond-checkin-lbl">' +
      t("flow.questCheckin") +
      "</p>" +
      '<p class="lc-pond-checkin-desc">' +
      t("flow.questCheckinDesc") +
      "</p>" +
      action +
      "</div>"
    );
  }

  function showPondToast(msg) {
    var el = document.getElementById("lcPondToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "lcPondToast";
      el.className = "lc-quest-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(showPondToast._t);
    showPondToast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2600);
  }

  function refreshSidePanel() {
    var sidePanel = document.getElementById("sidePanel");
    if (!sidePanel) return;
    var stats = global.LCApp && LCApp.getLearnStats ? LCApp.getLearnStats() : {};
    sidePanel.innerHTML =
      renderTopBar(stats) + renderSidePanel(stats, consumeLessonFinishPayload());
    bindSidePanelActions();
    if (global.RNFFrogLogo) RNFFrogLogo.mount(sidePanel);
  }

  function bindSidePanelActions() {
    var checkinBtn = document.querySelector("[data-pond-checkin]");
    if (checkinBtn) {
      checkinBtn.addEventListener("click", function () {
        if (!global.RNFQuestSystem || !RNFQuestSystem.doCheckin) return;
        RNFQuestSystem.doCheckin();
        showPondToast(t("flow.questCheckinDone"));
        refreshSidePanel();
      });
    }
    var claimBtn = document.querySelector("[data-pond-claim-checkin]");
    if (claimBtn) {
      claimBtn.addEventListener("click", function () {
        if (!global.RNFQuestSystem || !RNFQuestSystem.claim) return;
        var r = RNFQuestSystem.claim("checkin");
        if (r.ok) {
          showPondToast(t("flow.questClaimedToast", { n: r.reward }));
          if (global.LCApp && LCApp.initGemsPicker) LCApp.initGemsPicker();
        }
        refreshSidePanel();
      });
    }
    var logoutBtn = document.querySelector("[data-pond-logout]");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        if (global.RNFPlayerAuth && RNFPlayerAuth.logout) {
          RNFPlayerAuth.logout();
        }
        location.href = "auth.html?mode=login";
      });
    }
  }

  function renderSidePanel(stats, lessonRecap) {
    var dailyPct = stats.dailyGoal
      ? Math.min(100, Math.round((stats.dailyXp / stats.dailyGoal) * 100))
      : 0;
    var dailyCur = Math.min(stats.dailyXp, stats.dailyGoal);
    var dailyDone = dailyCur >= stats.dailyGoal;
    var boardLeft = getBoardUnitsLeft();

    return (
      renderHubProfileCard() +
      renderLessonRecapWidget(lessonRecap) +
      renderHubExploreGrid() +
      '<div class="lc-panel-card lc-shop-board-card lc-pond-widget">' +
      "<h3 class=\"lc-panel-title\">" +
      t("flow.learnBoardTitle") +
      "</h3>" +
      '<div class="lc-shop-board-row">' +
      '<span class="lc-shop-board-shield" aria-hidden="true">🛡️</span>' +
      '<p class="lc-panel-text">' +
      (boardLeft === 0
        ? t("flow.learnBoardUnlocked")
        : t("flow.learnBoardIsland", { n: boardLeft })) +
      "</p>" +
      (boardLeft === 0
        ? '<a class="lc-panel-link" href="leaderboard.html">' +
          t("flow.hubQuickLeaderboard") +
          "</a>"
        : "") +
      "</div></div>" +
      '<div class="lc-panel-card lc-panel-daily lc-pond-widget lc-pond-widget--daily">' +
      '<div class="lc-panel-head-row">' +
      "<h3 class=\"lc-panel-title\">" +
      t("flow.learnDailyTitle") +
      "</h3>" +
      '<a href="quests.html" class="lc-panel-link">' +
      t("flow.learnShowAll") +
      "</a></div>" +
      renderDailyCheckinBlock() +
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
  var jumpTargetStage = null;

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
    jumpOverlayEl.querySelector(".lc-jump-msg").textContent =
      t("flow.jumpTestPrompt", { n: part }) +
      "\n" +
      t("flow.pathJumpRisk", {
        win: global.RNFPathProgress ? RNFPathProgress.GEM_JUMP_WIN : 10,
        lose: global.RNFPathProgress ? RNFPathProgress.GEM_JUMP_FAIL : 3,
      });
    jumpOverlayEl.querySelector("[data-jump-later]").textContent = t("flow.jumpTestLater");
    jumpOverlayEl.querySelector("[data-jump-start]").textContent = t("flow.jumpTestStart");
  }

  function openJumpModal(targetPart, targetStage) {
    jumpTargetPart = targetPart;
    jumpTargetStage = targetStage || getActiveUnit().stage;
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
    var stage = jumpTargetStage || getActiveUnit().stage;
    try {
      sessionStorage.setItem("rnf_jump_test_part", String(part));
    } catch (e) {}
    location.href =
      "lesson.html?mode=jump&part=" +
      encodeURIComponent(part) +
      "&stage=" +
      encodeURIComponent(stage);
  }

  function bindJumpButtons(root) {
    if (root._jumpClickBound) return;
    root._jumpClickBound = true;
    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".lc-pond-jump-btn");
      if (!btn || !root.contains(btn)) return;
      var part = parseInt(btn.getAttribute("data-target-part") || "", 10);
      var stage = parseInt(btn.getAttribute("data-target-stage") || "", 10);
      if (!part || isNaN(part)) part = getActiveUnit().part + 1;
      if (!stage || isNaN(stage)) stage = getActiveUnit().stage;
      openJumpModal(part, stage);
    });
  }

  function bindPondScroll(root) {
    var btn = root.querySelector("[data-pond-scroll]");
    var scroll = root.querySelector(".lc-pond-scroll");
    if (!btn || !scroll) return;
    btn.addEventListener("click", function () {
      var lake = scroll.querySelector(".lc-pond-lake-wrap");
      if (lake) {
        lake.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        scroll.scrollBy({ left: 220, behavior: "smooth" });
      }
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
    var statsMount = document.getElementById("learnStatsMount");
    if (!pathCol) return;

    if (statsMount) statsMount.innerHTML = renderTopBar(stats);
    if (global.LCApp && LCApp.syncLearnCourseLabel) LCApp.syncLearnCourseLabel();

    pathCol.innerHTML = renderChapterBanner() + renderPondJourney();

    if (sidePanel) {
      sidePanel.innerHTML = renderSidePanel(stats, consumeLessonFinishPayload());
      bindSidePanelActions();
    }

    if (!global._rnfPondQuestListener) {
      global._rnfPondQuestListener = true;
      document.addEventListener("rnf:quests-change", function () {
        refreshSidePanel();
      });
    }

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    bindJumpButtons(pathCol);
    bindPondScroll(pathCol);
    bindCheerRotation(pathCol);
    bindTipsRotation(pathCol);

    var currentStop = pathCol.querySelector(".lc-pond-stop--current");
    var pondScroll = pathCol.querySelector(".lc-pond-scroll");
    if (currentStop && pondScroll) {
      setTimeout(function () {
        currentStop.scrollIntoView({
          inline: "center",
          block: "center",
          behavior: "smooth",
        });
      }, 180);
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
    refreshSidePanel: refreshSidePanel,
    getBoardUnitsLeft: getBoardUnitsLeft,
    openJumpModal: openJumpModal,
    closeJumpModal: closeJumpModal,
    refreshJumpModalCopy: refreshJumpModalCopy,
    bindCheerRotation: bindCheerRotation,
  };
})(typeof window !== "undefined" ? window : this);
