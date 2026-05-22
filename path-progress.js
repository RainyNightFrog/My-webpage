/**
 * Learning path progress, stage difficulty, gem rewards — Rainy Night Frog
 */
(function (global) {
  var GEM_JUMP_WIN = 10;
  var GEM_JUMP_FAIL = 3;
  var GEM_CHALLENGE = 3;
  var GEM_CHEST = 4;
  var MAX_STAGE = 5;
  var MAX_PART = 3;

  var CHALLENGE_MIN_ACC = 60;
  var DRILL_MIN_ACC = 50;

  var NODE_REWARDS = {
    star: { gems: 1, xp: 10, difficulty: 0 },
    listen: { gems: 2, xp: 8, difficulty: 1 },
    practice: { gems: 2, xp: 12, difficulty: 2 },
    quiz: { gems: 2, xp: 14, difficulty: 2 },
    vocab: { gems: 2, xp: 11, difficulty: 1 },
    flash: { gems: 2, xp: 10, difficulty: 2 },
    match: { gems: 2, xp: 12, difficulty: 3 },
    chest: { gems: 4, xp: 6, difficulty: 0 },
    story: { gems: 1, xp: 10, difficulty: 2 },
    bonus: { gems: 5, xp: 18, difficulty: 1 },
    trophy: { gems: 5, xp: 22, difficulty: 5, boss: true },
    raid: { gems: 8, xp: 28, difficulty: 8, boss: true },
  };

  var STAGES = [
    {
      stage: 1,
      tier: 1,
      topicKey: "flow.pathStage1Topic",
      subKey: "flow.pathStage1Sub",
      banner: "moon",
      sceneClass: "lc-pond-scene--s1",
      guideSection: 1,
    },
    {
      stage: 2,
      tier: 2,
      topicKey: "flow.pathStage2Topic",
      subKey: "flow.pathStage2Sub",
      banner: "blue",
      sceneClass: "lc-pond-scene--s2",
      guideSection: 2,
    },
    {
      stage: 3,
      tier: 3,
      topicKey: "flow.pathStage3Topic",
      subKey: "flow.pathStage3Sub",
      banner: "violet",
      sceneClass: "lc-pond-scene--s3",
      guideSection: 3,
    },
    {
      stage: 4,
      tier: 4,
      topicKey: "flow.pathStage4Topic",
      subKey: "flow.pathStage4Sub",
      banner: "ember",
      sceneClass: "lc-pond-scene--s4",
      guideSection: 4,
    },
    {
      stage: 5,
      tier: 5,
      topicKey: "flow.pathStage5Topic",
      subKey: "flow.pathStage5Sub",
      banner: "gold",
      sceneClass: "lc-pond-scene--s5",
      guideSection: 5,
    },
  ];

  var PATH_ANIMALS = [
    { emoji: "🐸", class: "lc-pond-animal--frog", left: "6%", top: "12%" },
    { emoji: "🦆", class: "lc-pond-animal--duck", left: "18%", top: "62%" },
    { emoji: "🐢", class: "lc-pond-animal--turtle", left: "32%", top: "8%" },
    { emoji: "🦉", class: "lc-pond-animal--owl", right: "28%", top: "14%" },
    { emoji: "🐰", class: "lc-pond-animal--bunny", right: "10%", top: "48%" },
    { emoji: "🦊", class: "lc-pond-animal--fox", left: "42%", top: "72%" },
    { emoji: "🐼", class: "lc-pond-animal--panda", right: "38%", top: "68%" },
    { emoji: "🐧", class: "lc-pond-animal--penguin", left: "52%", top: "18%" },
    { emoji: "🦋", class: "lc-pond-animal--butterfly", right: "52%", top: "32%" },
    { emoji: "🐠", class: "lc-pond-animal--fish", left: "72%", top: "55%" },
    { emoji: "🐙", class: "lc-pond-animal--octo", right: "18%", top: "78%" },
    { emoji: "🦄", class: "lc-pond-animal--unicorn", left: "78%", top: "22%" },
  ];

  function courseKey() {
    try {
      return sessionStorage.getItem("learn_target") || "en";
    } catch (e) {
      return "en";
    }
  }

  function storageKey() {
    return "rnf_path_" + courseKey();
  }

  function lessonCtxKey() {
    return "rnf_path_lesson";
  }

  function defaultProgress() {
    return {
      stage: 1,
      part: 1,
      nodeIndex: 0,
      lessonIndex: 0,
      doneIds: [],
      chestClaimed: {},
    };
  }

  function loadProgress() {
    try {
      var raw = localStorage.getItem(storageKey());
      if (!raw) return defaultProgress();
      var p = JSON.parse(raw);
      return {
        stage: p.stage || 1,
        part: p.part || 1,
        nodeIndex:
          typeof p.lessonIndex === "number"
            ? p.lessonIndex
            : typeof p.nodeIndex === "number"
              ? p.nodeIndex
              : 0,
        doneIds: p.doneIds || [],
        chestClaimed: p.chestClaimed || {},
      };
    } catch (e) {
      return defaultProgress();
    }
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(p));
    } catch (e) {}
  }

  function getStageMeta(stageNum) {
    for (var i = 0; i < STAGES.length; i++) {
      if (STAGES[i].stage === stageNum) return STAGES[i];
    }
    return STAGES[0];
  }

  function scaleNodeReward(type, stage, part) {
    var base = NODE_REWARDS[type] || NODE_REWARDS.star;
    var mult = 1 + (stage - 1) * 0.14 + (part - 1) * 0.07;
    return {
      gems: Math.max(1, Math.round(base.gems * mult)),
      xp: Math.max(6, Math.round(base.xp * mult)),
      difficulty: base.difficulty + (stage - 1) * 2 + (part - 1),
      boss: !!base.boss,
    };
  }

  function mkNode(id, type, stage, part, extra) {
    extra = extra || {};
    var r = scaleNodeReward(type, stage, part);
    var n = {
      id: id,
      type: type,
      playKey: extra.playKey,
      gemHint: extra.gemHint,
      jumpStyle: extra.jumpStyle,
      showTip: extra.showTip,
      targetPart: extra.targetPart,
      targetStage: extra.targetStage,
      gemReward: r.gems,
      xpReward: r.xp,
      xpHint: r.xp,
      difficulty: r.difficulty,
      boss: r.boss,
    };
    return n;
  }

  function buildMeadowNodes(sid, stage, part) {
    var jumpTargetPart = Math.min(MAX_PART, part + 1);
    var jumpTargetStage = part >= MAX_PART ? Math.min(MAX_STAGE, stage + 1) : stage;
    return [
      mkNode(sid + "-jump1", "jump", stage, part, {
        jumpStyle: "blue",
        showTip: true,
        targetPart: jumpTargetPart,
        targetStage: jumpTargetStage,
        gemHint: "jump",
      }),
      mkNode(sid + "-l1", "star", stage, part, { playKey: "flow.pathPlayLesson" }),
      mkNode(sid + "-vocab", "vocab", stage, part, { playKey: "flow.pathPlayVocab" }),
      mkNode(sid + "-listen", "listen", stage, part, { playKey: "flow.pathPlayListen" }),
      mkNode(sid + "-drill1", "practice", stage, part, { playKey: "flow.pathPlayDrill" }),
      mkNode(sid + "-chest1", "chest", stage, part, {
        gemHint: "chest",
        playKey: "flow.pathPlayChest",
      }),
      mkNode(sid + "-match", "match", stage, part, { playKey: "flow.pathPlayMatch" }),
      mkNode(sid + "-flash", "flash", stage, part, { playKey: "flow.pathPlayFlash" }),
      mkNode(sid + "-l2", "star", stage, part, { playKey: "flow.pathPlayLesson" }),
      mkNode(sid + "-boss1", "trophy", stage, part, {
        gemHint: "challenge",
        playKey: "flow.pathPlayBoss",
      }),
      mkNode(sid + "-quiz", "quiz", stage, part, { playKey: "flow.pathPlayQuiz" }),
      mkNode(sid + "-bonus", "bonus", stage, part, {
        gemHint: "bonus",
        playKey: "flow.pathPlayBonus",
      }),
    ];
  }

  function buildForestNodes(sid, stage, part) {
    return [
      mkNode(sid + "-listen3", "listen", stage, part, { playKey: "flow.pathPlayListen" }),
      mkNode(sid + "-drill3", "practice", stage, part, { playKey: "flow.pathPlayDrill" }),
      mkNode(sid + "-match2", "match", stage, part, { playKey: "flow.pathPlayMatch" }),
      mkNode(sid + "-story", "story", stage, part, { playKey: "flow.pathPlayStory" }),
      mkNode(sid + "-chest3", "chest", stage, part, {
        gemHint: "chest",
        playKey: "flow.pathPlayChest",
      }),
      mkNode(sid + "-vocab2", "vocab", stage, part, { playKey: "flow.pathPlayVocab" }),
      mkNode(sid + "-mini", "trophy", stage, part, {
        gemHint: "challenge",
        playKey: "flow.pathPlayMiniBoss",
      }),
      mkNode(sid + "-quiz2", "quiz", stage, part, { playKey: "flow.pathPlayQuiz" }),
    ];
  }

  function buildCoralNodes(sid, stage, part) {
    var jumpTargetPart = Math.min(MAX_PART, part + 1);
    var jumpTargetStage = part >= MAX_PART ? Math.min(MAX_STAGE, stage + 1) : stage;
    return [
      mkNode(sid + "-jump2", "jump", stage, part, {
        jumpStyle: "pink",
        showTip: part < MAX_PART,
        targetPart: jumpTargetPart,
        targetStage: jumpTargetStage,
        gemHint: "jump",
      }),
      mkNode(sid + "-story2", "story", stage, part, { playKey: "flow.pathPlayStory" }),
      mkNode(sid + "-drill2", "practice", stage, part, { playKey: "flow.pathPlayDrill" }),
      mkNode(sid + "-chest2", "chest", stage, part, {
        gemHint: "chest",
        playKey: "flow.pathPlayChest",
      }),
      mkNode(sid + "-l3", "star", stage, part, { playKey: "flow.pathPlayLesson" }),
      mkNode(sid + "-raid", "raid", stage, part, {
        gemHint: "challenge",
        playKey: "flow.pathPlayRaid",
      }),
      mkNode(sid + "-listen2", "listen", stage, part, { playKey: "flow.pathPlayListen" }),
      mkNode(sid + "-boss2", "trophy", stage, part, {
        gemHint: "challenge",
        playKey: "flow.pathPlayBoss",
      }),
      mkNode(sid + "-l4", "star", stage, part, { playKey: "flow.pathPlayLesson" }),
      mkNode(sid + "-flash2", "flash", stage, part, { playKey: "flow.pathPlayFlash" }),
    ];
  }

  function buildLakeNodes(sid, stage, part) {
    return [
      mkNode(sid + "-lk-c1", "chest", stage, part, {
        gemHint: "chest",
        playKey: "flow.pathPlayChest",
      }),
      mkNode(sid + "-lk-listen1", "listen", stage, part, {
        playKey: "flow.pathPlayListen",
      }),
      mkNode(sid + "-lk-vocab", "vocab", stage, part, {
        playKey: "flow.pathPlayVocab",
      }),
      mkNode(sid + "-lk-drill", "practice", stage, part, {
        playKey: "flow.pathPlayDrill",
      }),
      mkNode(sid + "-lk-bonus", "bonus", stage, part, {
        gemHint: "bonus",
        playKey: "flow.pathPlayBonus",
      }),
      mkNode(sid + "-lk-star", "star", stage, part, {
        playKey: "flow.pathPlayLesson",
      }),
      mkNode(sid + "-lk-match", "match", stage, part, {
        playKey: "flow.pathPlayMatch",
      }),
      mkNode(sid + "-lk-flash", "flash", stage, part, {
        playKey: "flow.pathPlayFlash",
      }),
      mkNode(sid + "-lk-c2", "chest", stage, part, {
        gemHint: "chest",
        playKey: "flow.pathPlayChest",
      }),
      mkNode(sid + "-lk-quiz", "quiz", stage, part, { playKey: "flow.pathPlayQuiz" }),
      mkNode(sid + "-lk-story", "story", stage, part, {
        playKey: "flow.pathPlayStory",
      }),
      mkNode(sid + "-lk-listen2", "listen", stage, part, {
        playKey: "flow.pathPlayListen",
      }),
      mkNode(sid + "-lk-practice2", "practice", stage, part, {
        playKey: "flow.pathPlayDrill",
      }),
      mkNode(sid + "-lk-c3", "chest", stage, part, {
        gemHint: "chest",
        playKey: "flow.pathPlayChest",
      }),
      mkNode(sid + "-lk-raid", "raid", stage, part, {
        gemHint: "challenge",
        playKey: "flow.pathPlayRaid",
      }),
    ];
  }

  function buildNodeBlueprint(stage, part) {
    var sid = "s" + stage + "p" + part;
    var meadowMascot = stage <= 1 ? "🐸" : stage <= 3 ? "🦉" : "🐉";
    var forestMascot = stage <= 2 ? "🦊" : "🐼";
    return [
      {
        zone: "lc-pond-zone--meadow",
        zoneKey: "flow.pondZoneMeadow",
        nodes: buildMeadowNodes(sid, stage, part),
        mascot: meadowMascot,
      },
      { divider: "flow.learnSectionForest" },
      {
        zone: "lc-pond-zone--forest",
        zoneKey: "flow.pondZoneForest",
        nodes: buildForestNodes(sid, stage, part),
        mascot: forestMascot,
      },
      { divider: "flow.learnSectionFriends" },
      {
        zone: "lc-pond-zone--coral",
        zoneKey: "flow.pondZoneCoral",
        nodes: buildCoralNodes(sid, stage, part),
        mascot: "🦆",
      },
      { divider: "flow.learnSectionLake" },
      {
        zone: "lc-pond-zone--lake",
        zoneKey: "flow.pondZoneLake",
        layout: "snake",
        rows: [5, 5, 5],
        nodes: buildLakeNodes(sid, stage, part),
        mascot: "🐠",
      },
    ];
  }

  function findNodeById(layout, nodeId) {
    if (!nodeId) return null;
    for (var i = 0; i < layout.length; i++) {
      var block = layout[i];
      if (!block.nodes) continue;
      for (var j = 0; j < block.nodes.length; j++) {
        if (block.nodes[j].id === nodeId) return block.nodes[j];
      }
    }
    return null;
  }

  function getPassThresholds(ctx) {
    var diff =
      (ctx && typeof ctx.difficulty === "number" ? ctx.difficulty : 0) +
      (ctx && ctx.tier ? (ctx.tier - 1) * 2 : 0);
    return {
      challenge: Math.min(88, CHALLENGE_MIN_ACC + Math.floor(diff * 2.2)),
      drill: Math.min(78, DRILL_MIN_ACC + Math.floor(diff * 1.8)),
      story: Math.min(72, 48 + Math.floor(diff * 1.5)),
    };
  }

  function flattenPlayable(layout) {
    var list = [];
    layout.forEach(function (block) {
      if (block.divider) {
        list.push({ kind: "divider", key: block.divider });
        return;
      }
      if (block.nodes) {
        block.nodes.forEach(function (n) {
          list.push({
            kind: "node",
            node: n,
            prop: block.prop,
            mascot: block.mascot,
            zone: block.zone,
          });
        });
      }
    });
    return list;
  }

  function playableNodeCount(layout) {
    var n = 0;
    flattenPlayable(layout).forEach(function (item) {
      if (item.kind === "node" && item.node.type !== "jump") n++;
    });
    return n;
  }

  function tierRankForNode(node, zone) {
    if (node.boss || node.type === "trophy" || node.type === "raid") return 3;
    if (zone === "lc-pond-zone--lake") return 3;
    if (zone === "lc-pond-zone--coral") return 2;
    if (zone === "lc-pond-zone--forest") return 2;
    if (typeof node.difficulty === "number" && node.difficulty >= 5) return 2;
    return 1;
  }

  function tierLabelKeyForRank(rank) {
    if (rank >= 3) return "flow.pathTierElite";
    if (rank >= 2) return "flow.pathTierAdvanced";
    return "flow.pathTierBasic";
  }

  function annotateLevelMeta(layout) {
    var ordered = [];
    layout.forEach(function (block) {
      if (!block.nodes) return;
      var zone = block.zone || "";
      block.nodes.forEach(function (n) {
        if (n.type === "jump") return;
        ordered.push({ node: n, zone: zone });
      });
    });
    var total = ordered.length;
    ordered.forEach(function (item, i) {
      var n = item.node;
      n.levelNum = i + 1;
      n.levelTotal = total;
      n.tierRank = tierRankForNode(n, item.zone);
      n.tierLabelKey = tierLabelKeyForRank(n.tierRank);
      if (i + 1 < ordered.length) {
        var next = ordered[i + 1].node;
        n.nextLevelNum = i + 2;
        n.nextTierRank = next.tierRank;
        n.nextIsAdvanced = next.tierRank > n.tierRank;
        n.nextTierLabelKey = tierLabelKeyForRank(next.tierRank);
      }
    });
    layout.forEach(function (block) {
      if (!block.nodes) return;
      var nums = [];
      block.nodes.forEach(function (n) {
        if (n.type !== "jump" && n.levelNum) nums.push(n.levelNum);
      });
      if (nums.length) {
        block.levelFrom = nums[0];
        block.levelTo = nums[nums.length - 1];
        var maxRank = 1;
        block.nodes.forEach(function (n) {
          if (n.tierRank && n.tierRank > maxRank) maxRank = n.tierRank;
        });
        block.zoneTierKey = tierLabelKeyForRank(maxRank);
      }
    });
    return layout;
  }

  function applyProgressToLayout(layout, progress) {
    var playableIndex = 0;
    layout.forEach(function (block) {
      if (block.divider) return;
      if (!block.nodes) return;
      block.nodes = block.nodes.map(function (node) {
        var copy = {};
        for (var k in node) {
          if (Object.prototype.hasOwnProperty.call(node, k)) copy[k] = node[k];
        }
        if (copy.type === "jump") {
          copy.state = "current";
          return copy;
        }
        if (playableIndex < progress.nodeIndex) {
          copy.state = "done";
        } else if (playableIndex === progress.nodeIndex) {
          copy.state = "current";
          copy.href = lessonUrlForNode(copy, progress);
          if (copy.type === "chest" && progress.chestClaimed[copy.id]) {
            copy.state = "done";
            delete copy.href;
          }
        } else {
          copy.state = "locked";
        }
        playableIndex++;
        return copy;
      });
    });
    return layout;
  }

  function lessonUrlForNode(node, progress) {
    var q =
      "lesson.html?path=" +
      encodeURIComponent(node.type) +
      "&node=" +
      encodeURIComponent(node.id) +
      "&stage=" +
      progress.stage +
      "&part=" +
      progress.part;
    if (
      node.type === "practice" ||
      node.type === "quiz" ||
      node.type === "flash" ||
      node.type === "vocab"
    ) {
      q += "&mode=drill";
    }
    if (node.type === "trophy" || node.type === "raid") q += "&mode=challenge";
    if (node.type === "chest" || node.type === "bonus") q += "&mode=chest";
    if (node.type === "listen") q += "&mode=listen";
    if (node.type === "match") q += "&mode=match";
    if (node.type === "story") q += "&mode=story";
    return q;
  }

  function setLessonContext(ctx) {
    try {
      sessionStorage.setItem(lessonCtxKey(), JSON.stringify(ctx));
    } catch (e) {}
  }

  function getLessonContext() {
    try {
      var raw = sessionStorage.getItem(lessonCtxKey());
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function clearLessonContext() {
    try {
      sessionStorage.removeItem(lessonCtxKey());
    } catch (e) {}
  }

  function parseLessonFromUrl(params) {
    params = params || new URLSearchParams(location.search);
    var pathType = params.get("path") || "star";
    var mode = params.get("mode") || "normal";
    if (mode === "drill") pathType = "practice";
    if (mode === "challenge") pathType = pathType === "raid" ? "raid" : "trophy";
    if (mode === "chest") pathType = pathType === "bonus" ? "bonus" : "chest";
    if (mode === "listen") pathType = "listen";
    if (mode === "match") pathType = "match";
    if (mode === "story") pathType = "story";
    if (pathType === "flash" || pathType === "vocab") pathType = pathType;
    if (params.get("mode") === "jump") pathType = "jump";
    return {
      pathType: pathType,
      mode: params.get("mode") || "normal",
      nodeId: params.get("node") || "",
      stage: parseInt(params.get("stage") || "1", 10) || 1,
      part: parseInt(params.get("part") || "1", 10) || 1,
      jumpPart: parseInt(params.get("part") || "", 10) || 0,
      jumpStage: parseInt(params.get("stage") || "", 10) || 0,
    };
  }

  function bindLessonFromUrl(params) {
    var parsed = parseLessonFromUrl(params);
    var progress = loadProgress();
    var meta = getStageMeta(parsed.stage || progress.stage);
    if (parsed.mode === "jump") {
      var jPart =
        parsed.jumpPart ||
        parseInt(
          (typeof sessionStorage !== "undefined" &&
            sessionStorage.getItem("rnf_jump_test_part")) ||
            "",
          10
        ) ||
        progress.part + 1;
      var jStage = parsed.jumpStage || progress.stage;
      var jumpMeta = getStageMeta(jStage);
      setLessonContext({
        pathType: "jump",
        mode: "jump",
        stage: jStage,
        part: jPart,
        tier: jumpMeta.tier,
        targetPart: jPart,
        targetStage: jStage,
      });
      return parsed;
    }
    var layout = buildNodeBlueprint(
      parsed.stage || progress.stage,
      parsed.part || progress.part
    );
    var node = findNodeById(layout, parsed.nodeId);
    setLessonContext({
      pathType: parsed.pathType,
      mode: parsed.mode,
      nodeId: parsed.nodeId,
      stage: parsed.stage || progress.stage,
      part: parsed.part || progress.part,
      tier: meta.tier,
      difficulty: node ? node.difficulty : meta.tier - 1,
      gemReward: node ? node.gemReward : 0,
      xpReward: node ? node.xpReward : 10,
      nodeType: node ? node.type : parsed.pathType,
    });
    return parsed;
  }

  function getActiveUnit() {
    var p = loadProgress();
    var meta = getStageMeta(p.stage);
    return {
      stage: p.stage,
      part: p.part,
      topicKey: meta.topicKey,
      subKey: meta.subKey,
      banner: meta.banner,
      sceneClass: meta.sceneClass,
      guideSection: meta.guideSection,
      tier: meta.tier,
      tierLabelKey: "flow.pathTier" + meta.tier,
    };
  }

  function buildPathLayout() {
    var progress = loadProgress();
    var layout = buildNodeBlueprint(progress.stage, progress.part);
    layout = applyProgressToLayout(layout, progress);
    return annotateLevelMeta(layout);
  }

  function getPathLevelSummary() {
    var progress = loadProgress();
    var layout = buildPathLayout();
    var total = playableNodeCount(
      buildNodeBlueprint(progress.stage, progress.part)
    );
    return {
      current: Math.min(total, progress.nodeIndex + 1),
      total: total,
      nodeIndex: progress.nodeIndex,
    };
  }

  function findNodeIndexById(layout, nodeId) {
    var i = 0;
    var items = flattenPlayable(layout);
    for (var j = 0; j < items.length; j++) {
      if (items[j].kind !== "node") continue;
      if (items[j].node.id === nodeId) return i;
      i++;
    }
    return -1;
  }

  function advanceNodeIndex(progress, layout) {
    var max = playableNodeCount(layout);
    progress.nodeIndex = Math.min(max, progress.nodeIndex + 1);
    if (progress.nodeIndex >= max) {
      progress.part += 1;
      if (progress.part > MAX_PART) {
        progress.part = 1;
        progress.stage = Math.min(MAX_STAGE, progress.stage + 1);
      }
      progress.nodeIndex = 1;
      progress.doneIds = [];
      progress.chestClaimed = {};
    }
    saveProgress(progress);
    return progress;
  }

  function markNodeDone(progress, nodeId) {
    if (progress.doneIds.indexOf(nodeId) < 0) progress.doneIds.push(nodeId);
    saveProgress(progress);
  }

  function applyJumpSuccess(targetStage, targetPart) {
    var progress = loadProgress();
    progress.stage = targetStage || progress.stage;
    progress.part = targetPart || progress.part;
    progress.nodeIndex = Math.max(progress.nodeIndex, 4);
    saveProgress(progress);
    if (global.RNFQuestSystem && RNFQuestSystem.trackTierAdvance) {
      RNFQuestSystem.trackTierAdvance();
    }
    return progress;
  }

  function addGems(amount) {
    if (!amount) return;
    try {
      var key = "rnf_gems_" + courseKey();
      var cur = parseInt(localStorage.getItem(key) || "0", 10) || 0;
      localStorage.setItem(key, String(Math.max(0, cur + amount)));
    } catch (e) {}
  }

  function defaultXpForType(pathType) {
    var base = NODE_REWARDS[pathType] || NODE_REWARDS.star;
    return base.xp;
  }

  function onLessonComplete(payload) {
    payload = payload || {};
    var progress = loadProgress();
    var layout = buildNodeBlueprint(progress.stage, progress.part);
    var ctx = getLessonContext() || {};
    var node = findNodeById(layout, ctx.nodeId);
    var acc = payload.acc != null ? payload.acc : 0;
    var mode = payload.mode || ctx.mode || "normal";
    var pathType = ctx.pathType || (node && node.type) || "star";
    var gemsEarned = 0;
    var xpEarned = 0;
    var rewardKey = "";
    var thresholds = getPassThresholds(ctx);

    if (mode === "jump") {
      if (payload.success) {
        gemsEarned = GEM_JUMP_WIN;
        xpEarned = 20;
        addGems(gemsEarned);
        applyJumpSuccess(ctx.targetStage, ctx.targetPart);
        rewardKey = "flow.pathGemJumpWin";
        if (global.RNFIslandProgress && RNFIslandProgress.recordNodeClear) {
          RNFIslandProgress.recordNodeClear({
            gems: gemsEarned,
            xp: xpEarned,
            stage: ctx.targetStage || progress.stage,
            part: ctx.targetPart || progress.part,
            acc: acc,
            nodeType: "jump",
          });
        }
      }
      clearLessonContext();
      return {
        gems: gemsEarned,
        xp: xpEarned,
        rewardKey: rewardKey,
        jump: true,
        success: !!payload.success,
      };
    }

    function awardNodeGems(amount, key) {
      if (!amount) return;
      gemsEarned += amount;
      addGems(amount);
      if (key) rewardKey = key;
    }

    var passed = true;
    if (pathType === "trophy" || mode === "challenge") {
      passed = acc >= thresholds.challenge;
      if (passed) {
        awardNodeGems(
          (node && node.gemReward) || GEM_CHALLENGE,
          "flow.pathGemChallenge"
        );
      } else {
        clearLessonContext();
        return {
          gems: 0,
          xp: 0,
          passed: false,
          rewardKey: "flow.pathChallengeFail",
        };
      }
    } else if (pathType === "bonus" || mode === "bonus") {
      awardNodeGems((node && node.gemReward) || 5, "flow.pathGemBonus");
      passed = true;
    } else if (pathType === "chest" || mode === "chest") {
      if (!progress.chestClaimed[ctx.nodeId]) {
        awardNodeGems((node && node.gemReward) || GEM_CHEST, "flow.pathGemChest");
        progress.chestClaimed[ctx.nodeId] = true;
        saveProgress(progress);
      }
      passed = true;
    } else if (pathType === "listen" || mode === "listen") {
      passed = acc >= thresholds.drill;
      if (passed) awardNodeGems((node && node.gemReward) || 2, "flow.pathGemListen");
    } else if (pathType === "match" || mode === "match") {
      passed = acc >= thresholds.challenge;
      if (passed) awardNodeGems((node && node.gemReward) || 2, "flow.pathGemMatch");
      else {
        clearLessonContext();
        return {
          gems: 0,
          xp: 0,
          passed: false,
          rewardKey: "flow.pathChallengeFail",
        };
      }
    } else if (pathType === "story" || mode === "story") {
      passed = acc >= thresholds.story;
      if (passed) awardNodeGems((node && node.gemReward) || 1, "flow.pathGemStory");
    } else if (pathType === "raid" || (mode === "challenge" && ctx.pathType === "raid")) {
      passed = acc >= thresholds.challenge;
      if (passed) {
        awardNodeGems(
          (node && node.gemReward) || GEM_CHALLENGE + 2,
          "flow.pathGemRaid"
        );
      } else {
        clearLessonContext();
        return {
          gems: 0,
          xp: 0,
          passed: false,
          rewardKey: "flow.pathChallengeFail",
        };
      }
    } else if (
      pathType === "practice" ||
      pathType === "quiz" ||
      pathType === "flash" ||
      pathType === "vocab" ||
      mode === "drill"
    ) {
      passed = acc >= thresholds.drill;
      if (!passed) {
        clearLessonContext();
        return { gems: 0, xp: 0, passed: false, rewardKey: "flow.pathDrillFail" };
      }
      if (pathType === "flash") {
        awardNodeGems((node && node.gemReward) || 2, "flow.pathGemFlash");
      } else if (pathType === "vocab") {
        awardNodeGems((node && node.gemReward) || 2, "flow.pathGemVocab");
      }
    } else if (pathType === "star") {
      passed = acc >= thresholds.drill;
      if (passed && node && node.gemReward) {
        awardNodeGems(node.gemReward, "flow.pathGemLesson");
      }
    }

    if (passed) {
      xpEarned =
        (node && node.xpReward) ||
        ctx.xpReward ||
        defaultXpForType(pathType);
      if (payload.correct != null && payload.answered) {
        var bonusXp = Math.min(8, Math.floor((payload.correct / payload.answered) * 4));
        xpEarned += bonusXp;
      }
      if (global.RNFIslandProgress && RNFIslandProgress.recordNodeClear) {
        RNFIslandProgress.recordNodeClear({
          gems: gemsEarned,
          xp: xpEarned,
          stage: progress.stage,
          part: progress.part,
          acc: acc,
          nodeType: pathType,
          nodeId: ctx.nodeId,
        });
      }
      if (ctx.nodeId) markNodeDone(progress, ctx.nodeId);
      progress = loadProgress();
      var stageBefore = progress.stage;
      advanceNodeIndex(progress, layout);
      progress = loadProgress();
      if (global.RNFQuestSystem) {
        if (RNFQuestSystem.trackAdventureStep) RNFQuestSystem.trackAdventureStep();
        if (progress.stage > stageBefore && RNFQuestSystem.trackTierAdvance) {
          RNFQuestSystem.trackTierAdvance();
        }
      }
    }

    clearLessonContext();
    return {
      gems: gemsEarned,
      xp: xpEarned,
      passed: passed,
      rewardKey: rewardKey,
      islandLevel:
        global.RNFIslandProgress && RNFIslandProgress.getIslandLevel
          ? RNFIslandProgress.getIslandLevel()
          : 1,
    };
  }

  function onJumpFail() {
    if (
      global.RNFShopInventory &&
      RNFShopInventory.consumeRevive &&
      RNFShopInventory.consumeRevive()
    ) {
      clearLessonContext();
      return { gems: 0, saved: true, rewardKey: "flow.shopReviveUsed" };
    }
    addGems(-GEM_JUMP_FAIL);
    clearLessonContext();
    return { gems: -GEM_JUMP_FAIL, rewardKey: "flow.pathGemJumpFail" };
  }

  function getPathTier(opts) {
    opts = opts || {};
    var ctx = getLessonContext();
    var base = ctx && ctx.tier ? ctx.tier : getStageMeta(loadProgress().stage).tier;
    if (opts.stage) base = getStageMeta(opts.stage).tier;
    var diff = ctx && typeof ctx.difficulty === "number" ? ctx.difficulty : 0;
    return Math.min(5, base + Math.floor(diff / 5));
  }

  function getPathProgressScore() {
    var p = loadProgress();
    var nodes = (p.doneIds && p.doneIds.length) || 0;
    var island = 0;
    if (global.RNFIslandProgress && RNFIslandProgress.getProgressScore) {
      island = RNFIslandProgress.getProgressScore();
    }
    return (p.stage || 1) * 22 + (p.part || 1) * 10 + nodes * 6 + (p.nodeIndex || 0) + island;
  }

  function renderPathAnimals() {
    var html = '<div class="lc-pond-animals" aria-hidden="true">';
    PATH_ANIMALS.forEach(function (a, i) {
      var style =
        (a.left ? "left:" + a.left + ";" : "") +
        (a.right ? "right:" + a.right + ";" : "") +
        (a.top ? "top:" + a.top + ";" : "") +
        'animation-delay:' + i * 0.35 + 's;';
      html +=
        '<span class="lc-pond-animal ' +
        a.class +
        '" style="' +
        style +
        '">' +
        a.emoji +
        "</span>";
    });
    html += "</div>";
    return html;
  }

  global.RNFPathProgress = {
    GEM_JUMP_WIN: GEM_JUMP_WIN,
    GEM_JUMP_FAIL: GEM_JUMP_FAIL,
    GEM_CHALLENGE: GEM_CHALLENGE,
    GEM_CHEST: GEM_CHEST,
    MAX_STAGE: MAX_STAGE,
    MAX_PART: MAX_PART,
    NODE_REWARDS: NODE_REWARDS,
    STAGES: STAGES,
    findNodeById: findNodeById,
    getPassThresholds: getPassThresholds,
    getPathProgressScore: getPathProgressScore,
    getPathLevelSummary: getPathLevelSummary,
    annotateLevelMeta: annotateLevelMeta,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    getActiveUnit: getActiveUnit,
    buildPathLayout: buildPathLayout,
    flattenPlayable: flattenPlayable,
    lessonUrlForNode: lessonUrlForNode,
    setLessonContext: setLessonContext,
    getLessonContext: getLessonContext,
    clearLessonContext: clearLessonContext,
    bindLessonFromUrl: bindLessonFromUrl,
    parseLessonFromUrl: parseLessonFromUrl,
    onLessonComplete: onLessonComplete,
    onJumpFail: onJumpFail,
    getPathTier: getPathTier,
    renderPathAnimals: renderPathAnimals,
    getStageMeta: getStageMeta,
  };
})(typeof window !== "undefined" ? window : this);
