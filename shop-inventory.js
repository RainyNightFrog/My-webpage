/**

 * Gem shop inventory & purchases — Rainy Night Frog

 */

(function (global) {

  var MAX_HEARTS = 5;



  var DEFAULT_INV = {

    heart: 0,

    revive: 0,

    challenge: 0,

    mission: 0,

    hint: 0,

    shield: 0,

    focus: 0,

    xpBoost: 0,

    gemCharm: 0,

    starBoost: 0,

    streakSave: 0,

  };



  var ITEMS = {

    heart: {

      id: "heart",

      cost: 1,

      icon: "❤️",

      titleKey: "flow.shopItemHeart",

      descKey: "flow.shopItemHeartDesc",

      btnKey: "flow.shopBuyGems",

      consumable: true,

      useInLesson: true,

      color: "rose",

      shopGroup: "lesson",

    },

    hint: {

      id: "hint",

      cost: 2,

      icon: "💡",

      titleKey: "flow.shopItemHint",

      descKey: "flow.shopItemHintDesc",

      btnKey: "flow.shopBuyGems",

      consumable: true,

      useInLesson: true,

      color: "amber",

      shopGroup: "lesson",

    },

    shield: {

      id: "shield",

      cost: 4,

      icon: "🛡️",

      titleKey: "flow.shopItemShield",

      descKey: "flow.shopItemShieldDesc",

      btnKey: "flow.shopBuyGems",

      consumable: true,

      useInLesson: true,

      color: "blue",

      shopGroup: "lesson",

    },

    focus: {

      id: "focus",

      cost: 2,

      icon: "🔍",

      titleKey: "flow.shopItemFocus",

      descKey: "flow.shopItemFocusDesc",

      btnKey: "flow.shopBuyGems",

      consumable: true,

      useInLesson: true,

      color: "cyan",

      shopGroup: "lesson",

    },

    xpBoost: {

      id: "xpBoost",

      cost: 3,

      icon: "⚡",

      titleKey: "flow.shopItemXp",

      descKey: "flow.shopItemXpDesc",

      btnKey: "flow.shopBuyGems",

      consumable: true,

      useInLesson: true,

      color: "violet",

      shopGroup: "lesson",

    },

    gemCharm: {

      id: "gemCharm",

      cost: 4,

      icon: "✨",

      titleKey: "flow.shopItemGem",

      descKey: "flow.shopItemGemDesc",

      btnKey: "flow.shopBuyGems",

      consumable: true,

      useInLesson: true,

      color: "gold",

      shopGroup: "lesson",

    },

    starBoost: {

      id: "starBoost",

      cost: 5,

      icon: "🌟",

      titleKey: "flow.shopItemStar",

      descKey: "flow.shopItemStarDesc",

      btnKey: "flow.shopBuyGems",

      consumable: true,

      useInLesson: true,

      color: "rainbow",

      shopGroup: "lesson",

    },

    streakSave: {

      id: "streakSave",

      cost: 3,

      icon: "🔥",

      titleKey: "flow.shopItemStreak",

      descKey: "flow.shopItemStreakDesc",

      btnKey: "flow.shopBuyGems",

      consumable: true,

      useInLesson: true,

      color: "orange",

      shopGroup: "lesson",

    },

    revive: {

      id: "revive",

      cost: 3,

      icon: "🪄",

      titleKey: "flow.shopItemRevive",

      descKey: "flow.shopItemReviveDesc",

      btnKey: "flow.shopBuyGems",

      consumable: false,

      useInLesson: false,

      color: "violet",

      shopGroup: "adventure",

    },

    challenge: {

      id: "challenge",

      cost: 3,

      icon: "🏆",

      titleKey: "flow.shopItemChallenge",

      descKey: "flow.shopItemChallengeDesc",

      btnKey: "flow.shopBuyGems",

      consumable: false,

      useInLesson: false,

      color: "gold",

      shopGroup: "adventure",

    },

    mission: {

      id: "mission",

      cost: 2,

      icon: "📋",

      titleKey: "flow.shopItemMission",

      descKey: "flow.shopItemMissionDesc",

      btnKey: "flow.shopBuyGems",

      consumable: false,

      useInLesson: false,

      color: "cyan",

      shopGroup: "daily",

    },

  };



  var SHOP_GROUPS = ["lesson", "adventure", "daily"];



  function courseKey() {

    try {

      return sessionStorage.getItem("learn_target") || "en";

    } catch (e) {

      return "en";

    }

  }



  function gemsKey() {

    return "rnf_gems_" + courseKey();

  }



  function heartsKey() {

    return "rnf_hearts_" + courseKey();

  }



  function invKey() {

    return "rnf_inventory_" + courseKey();

  }



  function mergeInv(raw) {

    var o = {};

    var k;

    for (k in DEFAULT_INV) {

      if (Object.prototype.hasOwnProperty.call(DEFAULT_INV, k)) {

        o[k] = DEFAULT_INV[k];

      }

    }

    if (raw && typeof raw === "object") {

      for (k in raw) {

        if (Object.prototype.hasOwnProperty.call(o, k)) {

          o[k] = parseInt(raw[k], 10) || 0;

        }

      }

    }

    return o;

  }



  function loadInventory() {

    try {

      var raw = localStorage.getItem(invKey());

      if (!raw) return mergeInv(null);

      return mergeInv(JSON.parse(raw));

    } catch (e) {

      return mergeInv(null);

    }

  }



  function saveInventory(inv) {

    try {

      localStorage.setItem(invKey(), JSON.stringify(inv));

    } catch (e) {}

  }



  function getGems() {

    try {

      return parseInt(localStorage.getItem(gemsKey()) || "0", 10) || 0;

    } catch (e) {

      return 0;

    }

  }



  function setGems(n) {

    try {

      localStorage.setItem(gemsKey(), String(Math.max(0, n)));

    } catch (e) {}

    if (global.document && document.dispatchEvent) {

      document.dispatchEvent(new CustomEvent("lc:heartschange"));

    }

  }



  function getHearts() {

    try {

      var n = parseInt(localStorage.getItem(heartsKey()) || String(MAX_HEARTS), 10);

      return Math.min(MAX_HEARTS, Math.max(0, isNaN(n) ? MAX_HEARTS : n));

    } catch (e) {

      return MAX_HEARTS;

    }

  }



  function setHearts(n) {

    try {

      localStorage.setItem(heartsKey(), String(Math.min(MAX_HEARTS, Math.max(0, n))));

    } catch (e) {}

    if (global.document && document.dispatchEvent) {

      document.dispatchEvent(new CustomEvent("lc:heartschange"));

    }

  }



  function purchase(itemId) {

    var item = ITEMS[itemId];

    if (!item) return { ok: false, reason: "unknown" };

    var gems = getGems();

    if (gems < item.cost) return { ok: false, reason: "gems" };



    if (itemId === "heart") {

      var hearts = getHearts();

      var inv = loadInventory();

      if (hearts >= MAX_HEARTS) {

        if ((inv.heart || 0) >= 5) return { ok: false, reason: "stash" };

        setGems(gems - item.cost);

        inv.heart = (inv.heart || 0) + 1;

        saveInventory(inv);

        return { ok: true, item: itemId, stashed: true };

      }

      setGems(gems - item.cost);

      setHearts(hearts + 1);

      return { ok: true, item: itemId };

    }



    var inv2 = loadInventory();

    setGems(gems - item.cost);

    inv2[itemId] = (inv2[itemId] || 0) + 1;

    saveInventory(inv2);

    return { ok: true, item: itemId };

  }



  function consumeItem(itemId) {

    var inv = loadInventory();

    if (!inv[itemId]) return false;

    inv[itemId] -= 1;

    saveInventory(inv);

    return true;

  }



  function consumeRevive() {

    return consumeItem("revive");

  }



  function consumeChallenge() {

    return consumeItem("challenge");

  }



  function consumeMission() {

    return consumeItem("mission");

  }



  function addMissionXp(amount) {

    var key =

      "rnf_daily_xp_" + courseKey() + "_" + new Date().toISOString().slice(0, 10);

    try {

      var raw = localStorage.getItem(key);

      var data = raw ? JSON.parse(raw) : { xp: 0 };

      data.xp = (data.xp || 0) + (amount || 5);

      localStorage.setItem(key, JSON.stringify(data));

    } catch (e) {}

  }



  function hasChallengeCard() {

    return loadInventory().challenge > 0;

  }



  function itemsInGroup(groupId) {

    return Object.keys(ITEMS).filter(function (id) {

      return ITEMS[id].shopGroup === groupId;

    });

  }



  global.RNFShopInventory = {

    ITEMS: ITEMS,

    SHOP_GROUPS: SHOP_GROUPS,

    MAX_HEARTS: MAX_HEARTS,

    loadInventory: loadInventory,

    saveInventory: saveInventory,

    getGems: getGems,

    getHearts: getHearts,

    setHearts: setHearts,

    purchase: purchase,

    consumeItem: consumeItem,

    consumeRevive: consumeRevive,

    consumeChallenge: consumeChallenge,

    consumeMission: consumeMission,

    addMissionXp: addMissionXp,

    hasChallengeCard: hasChallengeCard,

    itemsInGroup: itemsInGroup,

  };

})(typeof window !== "undefined" ? window : this);

