/**
 * Daily quest system — XP, adventure step, tier advance, check-in.
 */
(function (global) {
  var STORAGE_PREFIX = "rnf_quests_";

  var QUESTS = [
    {
      id: "daily_xp",
      goal: 10,
      reward: 10,
      icon: "⚡",
      titleKey: "flow.questDailyXp",
      descKey: "flow.questDailyXpDesc",
      syncKey: "xp",
    },
    {
      id: "adventure_step",
      goal: 1,
      reward: 10,
      icon: "🏝️",
      titleKey: "flow.questAdventureStep",
      descKey: "flow.questAdventureStepDesc",
      syncKey: "step",
    },
    {
      id: "tier_advance",
      goal: 1,
      reward: 30,
      icon: "🚀",
      titleKey: "flow.questTierAdvance",
      descKey: "flow.questTierAdvanceDesc",
      syncKey: "tier",
    },
    {
      id: "checkin",
      goal: 1,
      reward: 10,
      icon: "📅",
      titleKey: "flow.questCheckin",
      descKey: "flow.questCheckinDesc",
      syncKey: "checkin",
    },
  ];

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function courseKey() {
    try {
      return sessionStorage.getItem("learn_target") || "en";
    } catch (e) {
      return "en";
    }
  }

  function storageKey() {
    return STORAGE_PREFIX + courseKey() + "_" + todayKey();
  }

  function defaultState() {
    var progress = {};
    var claimed = {};
    QUESTS.forEach(function (q) {
      progress[q.id] = 0;
      claimed[q.id] = false;
    });
    return {
      date: todayKey(),
      progress: progress,
      claimed: claimed,
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(storageKey());
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.date === todayKey()) {
          s.progress = s.progress || {};
          s.claimed = s.claimed || {};
          QUESTS.forEach(function (q) {
            if (s.progress[q.id] == null) s.progress[q.id] = 0;
            if (s.claimed[q.id] == null) s.claimed[q.id] = false;
          });
          return s;
        }
      }
    } catch (e) {}
    return defaultState();
  }

  function saveState(state) {
    try {
      state.date = todayKey();
      localStorage.setItem(storageKey(), JSON.stringify(state));
    } catch (e) {}
    try {
      if (global.document && document.dispatchEvent) {
        document.dispatchEvent(new CustomEvent("rnf:quests-change"));
      }
    } catch (e2) {}
  }

  function addGems(amount) {
    if (!amount) return;
    try {
      var key = "rnf_gems_" + courseKey();
      var cur = parseInt(localStorage.getItem(key) || "0", 10) || 0;
      localStorage.setItem(key, String(Math.max(0, cur + amount)));
    } catch (e) {}
    if (global.LCApp && LCApp.initGemsPicker) {
      try {
        LCApp.initGemsPicker();
      } catch (e2) {}
    }
  }

  function syncDailyXp(state) {
    var xp = 0;
    if (global.LCApp && LCApp.getLearnStats) {
      xp = LCApp.getLearnStats().dailyXp || 0;
    }
    var q = QUESTS[0];
    state.progress.daily_xp = Math.min(q.goal, xp);
    return state;
  }

  function bumpProgress(state, id, delta) {
    var def = null;
    for (var i = 0; i < QUESTS.length; i++) {
      if (QUESTS[i].id === id) {
        def = QUESTS[i];
        break;
      }
    }
    if (!def) return state;
    var cur = state.progress[id] || 0;
    state.progress[id] = Math.min(def.goal, cur + (delta || 1));
    return state;
  }

  function getQuestStatus(state) {
    syncDailyXp(state);
    return QUESTS.map(function (def) {
      var progress = state.progress[def.id] || 0;
      var done = progress >= def.goal;
      var claimed = !!state.claimed[def.id];
      return {
        id: def.id,
        goal: def.goal,
        reward: def.reward,
        icon: def.icon,
        titleKey: def.titleKey,
        descKey: def.descKey,
        progress: progress,
        done: done,
        claimed: claimed,
        canClaim: done && !claimed,
      };
    });
  }

  function getSummary() {
    var state = loadState();
    var list = getQuestStatus(state);
    var done = 0;
    var claimed = 0;
    var gemsEarned = 0;
    var gemsAvailable = 0;
    list.forEach(function (q) {
      if (q.done) done += 1;
      if (q.claimed) {
        claimed += 1;
        gemsEarned += q.reward;
      } else if (q.canClaim) {
        gemsAvailable += q.reward;
      }
    });
    return {
      total: list.length,
      done: done,
      claimed: claimed,
      gemsEarned: gemsEarned,
      gemsAvailable: gemsAvailable,
      quests: list,
      hoursLeft: hoursUntilReset(),
    };
  }

  function hoursUntilReset() {
    var now = new Date();
    var end = new Date(now);
    end.setHours(24, 0, 0, 0);
    return Math.max(1, Math.ceil((end - now) / (1000 * 60 * 60)));
  }

  function trackAdventureStep() {
    var state = loadState();
    bumpProgress(state, "adventure_step", 1);
    saveState(state);
  }

  function trackTierAdvance() {
    var state = loadState();
    bumpProgress(state, "tier_advance", 1);
    saveState(state);
  }

  function doCheckin() {
    var state = loadState();
    state.progress.checkin = 1;
    saveState(state);
    return true;
  }

  function claim(questId) {
    var state = loadState();
    syncDailyXp(state);
    var def = null;
    var status = null;
    var list = getQuestStatus(state);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === questId) {
        status = list[i];
        def = QUESTS[i];
        break;
      }
    }
    if (!status || !status.canClaim || !def) {
      return { ok: false };
    }
    state.claimed[questId] = true;
    addGems(def.reward);
    saveState(state);
    if (global.RNFLeaderboardData && RNFLeaderboardData.recordHighlight) {
      RNFLeaderboardData.recordHighlight({
        id: "hi_quest_" + questId + "_" + todayKey(),
        emoji: "💎",
        titleKey: "flow.questHiClaimed",
        vars: { n: def.reward, task: t(def.titleKey, { n: def.goal }) },
      });
    }
    return { ok: true, reward: def.reward };
  }

  function claimAll() {
    var claimed = 0;
    var gems = 0;
    getSummary().quests.forEach(function (q) {
      if (q.canClaim) {
        var r = claim(q.id);
        if (r.ok) {
          claimed += 1;
          gems += r.reward;
        }
      }
    });
    return { claimed: claimed, gems: gems };
  }

  global.RNFQuestSystem = {
    QUESTS: QUESTS,
    getSummary: getSummary,
    claim: claim,
    claimAll: claimAll,
    doCheckin: doCheckin,
    trackAdventureStep: trackAdventureStep,
    trackTierAdvance: trackTierAdvance,
    hoursUntilReset: hoursUntilReset,
  };
})(typeof window !== "undefined" ? window : this);
