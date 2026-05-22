/**
 * Leaderboard data — player stats, rivals, rankings, highlight moments.
 */
(function (global) {
  var HIGHLIGHTS_KEY = "rnf_lb_highlights";
  var MAX_HIGHLIGHTS = 24;

  var RIVALS = [
    { id: "r1", name: "雷霆 Max", avatar: "🦁", xp: 4200, gems: 186, progress: 58 },
    { id: "r2", name: "星光 Mia", avatar: "🦊", xp: 3850, gems: 172, progress: 54 },
    { id: "r3", name: "海浪 Kai", avatar: "🐬", xp: 3620, gems: 210, progress: 49 },
    { id: "r4", name: "月牙 Yuki", avatar: "🐰", xp: 3100, gems: 145, progress: 46 },
    { id: "r5", name: "烈焰 Rio", avatar: "🐯", xp: 2880, gems: 132, progress: 44 },
    { id: "r6", name: "微風 Luna", avatar: "🦋", xp: 2650, gems: 158, progress: 41 },
    { id: "r7", name: "岩石 Duke", avatar: "🐻", xp: 2420, gems: 98, progress: 38 },
    { id: "r8", name: "彩虹 Zoe", avatar: "🦄", xp: 2180, gems: 175, progress: 36 },
    { id: "r9", name: "疾風 Ace", avatar: "🦅", xp: 1950, gems: 88, progress: 33 },
    { id: "r10", name: "雲朵 Nia", avatar: "🐧", xp: 1720, gems: 76, progress: 30 },
    { id: "r11", name: "琥珀 Tom", avatar: "🐱", xp: 1480, gems: 112, progress: 27 },
    { id: "r12", name: "冰川 Sky", avatar: "🐳", xp: 1250, gems: 95, progress: 24 },
    { id: "r13", name: "叢林 Pip", avatar: "🐵", xp: 980, gems: 62, progress: 21 },
    { id: "r14", name: "珊瑚 Eve", avatar: "🐙", xp: 720, gems: 140, progress: 18 },
    { id: "r15", name: "晨露 Kim", avatar: "🌸", xp: 420, gems: 45, progress: 12 },
  ];

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function weekSeed() {
    return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  }

  function hashId(id) {
    var h = 0;
    var s = String(id) + String(weekSeed());
    for (var i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function getLearnTarget() {
    try {
      return sessionStorage.getItem("learn_target") || "en";
    } catch (e) {
      return "en";
    }
  }

  function getTotalXp() {
    try {
      return parseInt(localStorage.getItem("rnf_total_xp") || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function getGems() {
    try {
      return (
        parseInt(localStorage.getItem("rnf_gems_" + getLearnTarget()) || "0", 10) ||
        0
      );
    } catch (e) {
      return 0;
    }
  }

  function getUnitsDone() {
    try {
      return parseInt(localStorage.getItem("rnf_units_done") || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function getStreak() {
    if (global.LCApp && LCApp.getLearnStats) {
      return LCApp.getLearnStats().streak || 1;
    }
    return 1;
  }

  function getPathProgressScore() {
    if (!global.RNFPathProgress || !RNFPathProgress.loadProgress) return 0;
    var p = RNFPathProgress.loadProgress();
    var nodes = (p.doneIds && p.doneIds.length) || 0;
    var stage = p.stage || 1;
    return stage * 10 + nodes * 3 + (p.nodeIndex || 0);
  }

  function getProgressScore() {
    return getUnitsDone() * 12 + getPathProgressScore();
  }

  function getAvatarEmoji() {
    try {
      var e = localStorage.getItem("rnf_avatar_emoji");
      if (e) return e;
    } catch (e1) {}
    return "🐸";
  }

  function getDisplayName() {
    if (global.RNFPlayerAuth && RNFPlayerAuth.getCurrentUser) {
      var u = RNFPlayerAuth.getCurrentUser();
      if (u && u.name && u.name.trim()) return u.name.trim();
      if (u && u.email) {
        var local = u.email.split("@")[0];
        return local.charAt(0).toUpperCase() + local.slice(1);
      }
    }
    try {
      var raw = localStorage.getItem("rnf_profile");
      if (raw) {
        var p = JSON.parse(raw);
        if (p.name && p.name.trim()) return p.name.trim();
        if (p.email) {
          var loc = p.email.split("@")[0];
          return loc.charAt(0).toUpperCase() + loc.slice(1);
        }
      }
    } catch (e2) {}
    return t("flow.profileGuest");
  }

  function getCurrentPlayer() {
    return {
      id: "me",
      name: getDisplayName(),
      avatar: getAvatarEmoji(),
      xp: getTotalXp(),
      gems: getGems(),
      progress: getProgressScore(),
      units: getUnitsDone(),
      streak: getStreak(),
      isMe: true,
    };
  }

  function scaledRivals() {
    var seed = weekSeed();
    return RIVALS.map(function (r) {
      var bump = (hashId(r.id) % 47) - 23 + (seed % 11);
      return {
        id: r.id,
        name: r.name,
        avatar: r.avatar,
        xp: Math.max(0, r.xp + bump * 8),
        gems: Math.max(0, r.gems + (hashId(r.id + "g") % 19) - 9),
        progress: Math.max(0, r.progress + (hashId(r.id + "p") % 7) - 3),
        isMe: false,
      };
    });
  }

  function metricKey(mode) {
    if (mode === "gems") return "gems";
    if (mode === "progress") return "progress";
    return "xp";
  }

  function formatMetric(entry, mode) {
    if (mode === "gems") {
      return t("flow.lbMetricGems", { n: entry.gems });
    }
    if (mode === "progress") {
      return t("flow.lbMetricProgress", { n: entry.progress });
    }
    return t("flow.lbMetricXp", { n: entry.xp });
  }

  function buildRankings(mode) {
    var key = metricKey(mode);
    var list = [getCurrentPlayer()].concat(scaledRivals());
    list.sort(function (a, b) {
      if (b[key] !== a[key]) return b[key] - a[key];
      if (a.isMe) return -1;
      if (b.isMe) return 1;
      return a.name.localeCompare(b.name);
    });
    list.forEach(function (entry, i) {
      entry.rank = i + 1;
      entry.metric = entry[key];
    });
    var me = list.filter(function (e) {
      return e.isMe;
    })[0];
    return { list: list, me: me, mode: mode };
  }

  function loadHighlights() {
    try {
      var raw = localStorage.getItem(HIGHLIGHTS_KEY);
      if (raw) {
        var arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      }
    } catch (e) {}
    return [];
  }

  function saveHighlights(arr) {
    try {
      localStorage.setItem(
        HIGHLIGHTS_KEY,
        JSON.stringify(arr.slice(0, MAX_HIGHLIGHTS))
      );
    } catch (e) {}
  }

  function recordHighlight(item) {
    if (!item || !item.id) return;
    var list = loadHighlights();
    if (list.some(function (h) {
      return h.id === item.id;
    })) {
      return;
    }
    list.unshift({
      id: item.id,
      emoji: item.emoji || "✨",
      titleKey: item.titleKey,
      title: item.title || "",
      detailKey: item.detailKey,
      detail: item.detail || "",
      vars: item.vars || {},
      ts: item.ts || Date.now(),
    });
    saveHighlights(list);
  }

  function highlightText(h, field) {
    if (h[field + "Key"]) {
      return t(h[field + "Key"], h.vars);
    }
    return h[field] || "";
  }

  function syncHighlightsFromStats() {
    var xp = getTotalXp();
    var gems = getGems();
    var streak = getStreak();
    var units = getUnitsDone();
    var rankings = buildRankings("xp");
    var me = rankings.me;

    if (xp >= 50) {
      recordHighlight({
        id: "hi_xp_50",
        emoji: "⚡",
        titleKey: "flow.lbHiXp",
        vars: { n: xp },
      });
    }
    if (gems >= 20) {
      recordHighlight({
        id: "hi_gems_20",
        emoji: "💎",
        titleKey: "flow.lbHiGems",
        vars: { n: gems },
      });
    }
    if (streak >= 3) {
      recordHighlight({
        id: "hi_streak_" + streak,
        emoji: "🔥",
        titleKey: "flow.lbHiStreak",
        vars: { n: streak },
      });
    }
    if (units >= 1) {
      recordHighlight({
        id: "hi_units_" + units,
        emoji: "📚",
        titleKey: "flow.lbHiUnits",
        vars: { n: units },
      });
    }
    if (me && me.rank <= 3) {
      recordHighlight({
        id: "hi_podium_" + weekSeed() + "_" + me.rank,
        emoji: me.rank === 1 ? "👑" : me.rank === 2 ? "🥈" : "🥉",
        titleKey: "flow.lbHiPodium",
        vars: { rank: me.rank },
      });
    }
    try {
      var top3 = parseInt(localStorage.getItem("rnf_top3_finishes") || "0", 10) || 0;
      if (top3 >= 1) {
        recordHighlight({
          id: "hi_top3_" + top3,
          emoji: "🏆",
          titleKey: "flow.lbHiTop3",
          vars: { n: top3 },
        });
      }
    } catch (e) {}
  }

  function getHighlights() {
    syncHighlightsFromStats();
    return loadHighlights();
  }

  function diffFromMe(entry, mode, me) {
    if (!me || entry.isMe) return 0;
    var key = metricKey(mode);
    return Math.max(0, (me[key] || 0) - (entry[key] || 0));
  }

  global.RNFLeaderboardData = {
    RIVALS: RIVALS,
    getCurrentPlayer: getCurrentPlayer,
    buildRankings: buildRankings,
    formatMetric: formatMetric,
    getHighlights: getHighlights,
    recordHighlight: recordHighlight,
    highlightText: highlightText,
    diffFromMe: diffFromMe,
    getTotalXp: getTotalXp,
    getGems: getGems,
    getProgressScore: getProgressScore,
  };
})(typeof window !== "undefined" ? window : this);
