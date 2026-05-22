/**
 * Learning path progress, stage difficulty, gem rewards — Rainy Night Frog
 */
(function (global) {
  var GEM_JUMP_WIN = 10;
  var GEM_JUMP_FAIL = 3;
  var GEM_CHALLENGE = 3;
  var GEM_CHEST = 4;

  var CHALLENGE_MIN_ACC = 60;
  var DRILL_MIN_ACC = 50;

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

  function buildNodeBlueprint(stage, part) {
    return [
      {
        nodes: [
          {
            id: "s" + stage + "p" + part + "-jump1",
            type: "jump",
            jumpStyle: "blue",
            showTip: true,
            targetPart: part + 2,
            targetStage: stage,
            gemHint: "jump",
          },
          { id: "s" + stage + "p" + part + "-l1", type: "star" },
          { id: "s" + stage + "p" + part + "-drill1", type: "practice" },
          { id: "s" + stage + "p" + part + "-chest1", type: "chest", gemHint: "chest" },
          { id: "s" + stage + "p" + part + "-l2", type: "star" },
          { id: "s" + stage + "p" + part + "-boss1", type: "trophy", gemHint: "challenge" },
        ],
        prop: "npc",
        mascot: stage === 1 ? "🐸" : stage === 2 ? "🦉" : "🐉",
      },
      { divider: "flow.learnSectionFriends" },
      {
        nodes: [
          {
            id: "s" + stage + "p" + part + "-jump2",
            type: "jump",
            jumpStyle: "pink",
            showTip: true,
            targetPart: part + 1,
            targetStage: Math.min(3, stage + 1),
            gemHint: "jump",
          },
          { id: "s" + stage + "p" + part + "-l3", type: "star" },
          { id: "s" + stage + "p" + part + "-drill2", type: "practice" },
          { id: "s" + stage + "p" + part + "-chest2", type: "chest", gemHint: "chest" },
          { id: "s" + stage + "p" + part + "-boss2", type: "trophy", gemHint: "challenge" },
          { id: "s" + stage + "p" + part + "-l4", type: "star" },
        ],
        mascot: "🦆",
      },
    ];
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
          list.push({ kind: "node", node: n, prop: block.prop, mascot: block.mascot });
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

  function applyProgressToLayout(layout, progress) {
    var lessonIndex = progress.nodeIndex;
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
        if (lessonIndex < progress.nodeIndex) {
          copy.state = "done";
        } else if (lessonIndex === progress.nodeIndex) {
          copy.state = "current";
          copy.href = lessonUrlForNode(copy, progress);
          if (copy.type === "chest" && progress.chestClaimed[copy.id]) {
            copy.state = "done";
            delete copy.href;
          }
        } else {
          copy.state = "locked";
        }
        lessonIndex++;
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
    if (node.type === "practice") q += "&mode=drill";
    if (node.type === "trophy") q += "&mode=challenge";
    if (node.type === "chest") q += "&mode=chest";
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
    if (mode === "challenge") pathType = "trophy";
    if (mode === "chest") pathType = "chest";
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
    setLessonContext({
      pathType: parsed.pathType,
      mode: parsed.mode,
      nodeId: parsed.nodeId,
      stage: parsed.stage || progress.stage,
      part: parsed.part || progress.part,
      tier: meta.tier,
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
    return applyProgressToLayout(layout, progress);
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
      if (progress.part > 2) {
        progress.part = 1;
        progress.stage = Math.min(3, progress.stage + 1);
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

  function onLessonComplete(payload) {
    payload = payload || {};
    var progress = loadProgress();
    var layout = buildNodeBlueprint(progress.stage, progress.part);
    var ctx = getLessonContext() || {};
    var acc = payload.acc != null ? payload.acc : 0;
    var mode = payload.mode || ctx.mode || "normal";
    var pathType = ctx.pathType || "star";
    var gemsEarned = 0;
    var rewardKey = "";

    if (mode === "jump") {
      if (payload.success) {
        gemsEarned = GEM_JUMP_WIN;
        addGems(gemsEarned);
        applyJumpSuccess(ctx.targetStage, ctx.targetPart);
        rewardKey = "flow.pathGemJumpWin";
      }
      clearLessonContext();
      return {
        gems: gemsEarned,
        rewardKey: rewardKey,
        jump: true,
        success: !!payload.success,
      };
    }

    var passed = true;
    if (pathType === "trophy" || mode === "challenge") {
      passed = acc >= CHALLENGE_MIN_ACC;
      if (passed) {
        gemsEarned = GEM_CHALLENGE;
        rewardKey = "flow.pathGemChallenge";
        addGems(gemsEarned);
      } else {
        clearLessonContext();
        return { gems: 0, passed: false, rewardKey: "flow.pathChallengeFail" };
      }
    } else if (pathType === "chest" || mode === "chest") {
      if (!progress.chestClaimed[ctx.nodeId]) {
        gemsEarned = GEM_CHEST;
        progress.chestClaimed[ctx.nodeId] = true;
        rewardKey = "flow.pathGemChest";
        addGems(gemsEarned);
      }
      passed = true;
    } else if (pathType === "practice" || mode === "drill") {
      passed = acc >= DRILL_MIN_ACC;
      if (!passed) {
        clearLessonContext();
        return { gems: 0, passed: false, rewardKey: "flow.pathDrillFail" };
      }
    }

    if (passed) {
      if (ctx.nodeId) markNodeDone(progress, ctx.nodeId);
      progress = loadProgress();
      advanceNodeIndex(progress, layout);
    }

    clearLessonContext();
    return { gems: gemsEarned, passed: passed, rewardKey: rewardKey };
  }

  function onJumpFail() {
    addGems(-GEM_JUMP_FAIL);
    clearLessonContext();
    return { gems: -GEM_JUMP_FAIL, rewardKey: "flow.pathGemJumpFail" };
  }

  function getPathTier(opts) {
    opts = opts || {};
    var ctx = getLessonContext();
    if (ctx && ctx.tier) return ctx.tier;
    if (opts.stage) return getStageMeta(opts.stage).tier;
    return getStageMeta(loadProgress().stage).tier;
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
    STAGES: STAGES,
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
