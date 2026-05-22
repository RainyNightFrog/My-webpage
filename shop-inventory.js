/**
 * Gem shop inventory & purchases — Rainy Night Frog
 */
(function (global) {
  var MAX_HEARTS = 5;

  var ITEMS = {
    heart: {
      id: "heart",
      cost: 1,
      icon: "❤️",
      titleKey: "flow.shopItemHeart",
      descKey: "flow.shopItemHeartDesc",
      btnKey: "flow.shopBuyGems",
      consumable: true,
      color: "rose",
    },
    revive: {
      id: "revive",
      cost: 3,
      icon: "🪄",
      titleKey: "flow.shopItemRevive",
      descKey: "flow.shopItemReviveDesc",
      btnKey: "flow.shopBuyGems",
      consumable: false,
      color: "violet",
    },
    challenge: {
      id: "challenge",
      cost: 3,
      icon: "🏆",
      titleKey: "flow.shopItemChallenge",
      descKey: "flow.shopItemChallengeDesc",
      btnKey: "flow.shopBuyGems",
      consumable: false,
      color: "gold",
    },
    mission: {
      id: "mission",
      cost: 2,
      icon: "📋",
      titleKey: "flow.shopItemMission",
      descKey: "flow.shopItemMissionDesc",
      btnKey: "flow.shopBuyGems",
      consumable: false,
      color: "cyan",
    },
  };

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

  function loadInventory() {
    try {
      var raw = localStorage.getItem(invKey());
      if (!raw) return { revive: 0, challenge: 0, mission: 0 };
      var o = JSON.parse(raw);
      return {
        revive: o.revive || 0,
        challenge: o.challenge || 0,
        mission: o.mission || 0,
      };
    } catch (e) {
      return { revive: 0, challenge: 0, mission: 0 };
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
      if (hearts >= MAX_HEARTS) return { ok: false, reason: "full" };
      setGems(gems - item.cost);
      setHearts(hearts + 1);
      return { ok: true, item: itemId };
    }

    var inv = loadInventory();
    setGems(gems - item.cost);
    inv[itemId] = (inv[itemId] || 0) + 1;
    saveInventory(inv);
    return { ok: true, item: itemId };
  }

  function consumeRevive() {
    var inv = loadInventory();
    if (!inv.revive) return false;
    inv.revive -= 1;
    saveInventory(inv);
    return true;
  }

  function consumeChallenge() {
    var inv = loadInventory();
    if (!inv.challenge) return false;
    inv.challenge -= 1;
    saveInventory(inv);
    return true;
  }

  function consumeMission() {
    var inv = loadInventory();
    if (!inv.mission) return false;
    inv.mission -= 1;
    saveInventory(inv);
    return true;
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

  global.RNFShopInventory = {
    ITEMS: ITEMS,
    MAX_HEARTS: MAX_HEARTS,
    loadInventory: loadInventory,
    getGems: getGems,
    getHearts: getHearts,
    purchase: purchase,
    consumeRevive: consumeRevive,
    consumeChallenge: consumeChallenge,
    consumeMission: consumeMission,
    addMissionXp: addMissionXp,
    hasChallengeCard: hasChallengeCard,
  };
})(typeof window !== "undefined" ? window : this);
