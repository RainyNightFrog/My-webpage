/**
 * 冒險島進度 — 打怪升級、節點通關、排行榜同步
 */
(function (global) {
  var STATS_PREFIX = "rnf_island_stats_";
  var XP_PER_LEVEL = 80;
  var LB_UNLOCK_NODES = 3;

  function courseKey() {
    try {
      return sessionStorage.getItem("learn_target") || "en";
    } catch (e) {
      return "en";
    }
  }

  function statsKey() {
    return STATS_PREFIX + courseKey();
  }

  function defaultStats() {
    return {
      nodesCleared: 0,
      bossesBeat: 0,
      raidsBeat: 0,
      gemsEarned: 0,
      xpEarned: 0,
      maxStage: 1,
      maxPart: 1,
      bestAcc: 0,
      clears: 0,
    };
  }

  function loadStats() {
    try {
      var raw = localStorage.getItem(statsKey());
      if (raw) {
        var s = JSON.parse(raw);
        return Object.assign(defaultStats(), s);
      }
    } catch (e) {}
    return defaultStats();
  }

  function saveStats(s) {
    try {
      localStorage.setItem(statsKey(), JSON.stringify(s));
    } catch (e) {}
    try {
      if (global.document && document.dispatchEvent) {
        document.dispatchEvent(new CustomEvent("rnf:island-progress"));
      }
    } catch (e2) {}
  }

  function addTotalXp(amount) {
    if (!amount) return;
    try {
      var cur = parseInt(localStorage.getItem("rnf_total_xp") || "0", 10) || 0;
      localStorage.setItem("rnf_total_xp", String(cur + amount));
    } catch (e) {}
  }

  function getIslandLevel() {
    var s = loadStats();
    return Math.max(1, 1 + Math.floor(s.xpEarned / XP_PER_LEVEL));
  }

  function xpToNextLevel() {
    var s = loadStats();
    var inLevel = s.xpEarned % XP_PER_LEVEL;
    return XP_PER_LEVEL - inLevel;
  }

  function getProgressScore() {
    var s = loadStats();
    var path = 0;
    if (global.RNFPathProgress && RNFPathProgress.loadProgress) {
      var p = RNFPathProgress.loadProgress();
      path = (p.stage || 1) * 25 + (p.part || 1) * 8 + (p.doneIds ? p.doneIds.length : 0) * 5;
    }
    return (
      s.nodesCleared * 18 +
      s.bossesBeat * 35 +
      s.raidsBeat * 50 +
      s.maxStage * 30 +
      Math.floor(s.xpEarned / 4) +
      path
    );
  }

  function syncLeaderboardHighlight(titleKey, vars) {
    if (global.RNFLeaderboardData && RNFLeaderboardData.recordHighlight) {
      global.RNFLeaderboardData.recordHighlight({
        id: "hi_island_" + titleKey + "_" + loadStats().nodesCleared,
        emoji: "🏝️",
        titleKey: titleKey,
        vars: vars || {},
      });
    }
  }

  function recordNodeClear(payload) {
    payload = payload || {};
    var s = loadStats();
    s.nodesCleared += 1;
    s.clears += 1;
    s.gemsEarned += payload.gems || 0;
    s.xpEarned += payload.xp || 0;
    if (payload.stage && payload.stage > s.maxStage) s.maxStage = payload.stage;
    if (payload.part && payload.part > s.maxPart) s.maxPart = payload.part;
    if (payload.acc != null && payload.acc > s.bestAcc) s.bestAcc = payload.acc;

    var nodeType = payload.nodeType || "";
    if (nodeType === "trophy" || nodeType === "boss") {
      s.bossesBeat += 1;
      syncLeaderboardHighlight("flow.islandHiBoss", { n: s.bossesBeat });
    }
    if (nodeType === "raid") {
      s.raidsBeat += 1;
      syncLeaderboardHighlight("flow.islandHiRaid", { n: s.raidsBeat });
    }
    if (s.nodesCleared === 1) {
      syncLeaderboardHighlight("flow.islandHiFirst", {});
    }
    if (s.nodesCleared % 5 === 0) {
      syncLeaderboardHighlight("flow.islandHiNodes", { n: s.nodesCleared });
    }
    if (getIslandLevel() >= 5 && s.xpEarned >= XP_PER_LEVEL * 4) {
      syncLeaderboardHighlight("flow.islandHiLevel", { lv: getIslandLevel() });
    }

    saveStats(s);
    if (payload.xp) addTotalXp(payload.xp);

    if (global.RNFAdventureIsland && RNFAdventureIsland.setUnlocked) {
      global.RNFAdventureIsland.setUnlocked();
    }
    return s;
  }

  function canShowLeaderboard() {
    return loadStats().nodesCleared >= LB_UNLOCK_NODES;
  }

  function getSummary() {
    var s = loadStats();
    return {
      stats: s,
      level: getIslandLevel(),
      xpToNext: xpToNextLevel(),
      progressScore: getProgressScore(),
      leaderboardReady: canShowLeaderboard(),
    };
  }

  global.RNFIslandProgress = {
    XP_PER_LEVEL: XP_PER_LEVEL,
    LB_UNLOCK_NODES: LB_UNLOCK_NODES,
    loadStats: loadStats,
    getIslandLevel: getIslandLevel,
    xpToNextLevel: xpToNextLevel,
    getProgressScore: getProgressScore,
    recordNodeClear: recordNodeClear,
    canShowLeaderboard: canShowLeaderboard,
    getSummary: getSummary,
  };
})(typeof window !== "undefined" ? window : this);
