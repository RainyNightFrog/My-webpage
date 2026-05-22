/**
 * Friends — add by name, chat (local), leaderboard sync
 */
(function (global) {
  var FRIENDS_KEY = "rnf_friends_v1";
  var CHAT_PREFIX = "rnf_friend_chat_";
  var PRESENCE_PREFIX = "rnf_friend_presence_";

  var DIRECTORY = [
    { id: "r1", name: "雷霆 Max", avatar: "🦁" },
    { id: "r2", name: "星光 Mia", avatar: "🦊" },
    { id: "r3", name: "海浪 Kai", avatar: "🐬" },
    { id: "r4", name: "月牙 Yuki", avatar: "🐰" },
    { id: "r5", name: "烈焰 Rio", avatar: "🐯" },
    { id: "r6", name: "微風 Luna", avatar: "🦋" },
    { id: "r7", name: "岩石 Duke", avatar: "🐻" },
    { id: "r8", name: "彩虹 Zoe", avatar: "🦄" },
    { id: "r9", name: "疾風 Ace", avatar: "🦅" },
    { id: "r10", name: "雲朵 Nia", avatar: "🐧" },
    { id: "r11", name: "琥珀 Tom", avatar: "🐱" },
    { id: "r12", name: "冰川 Sky", avatar: "🐳" },
    { id: "r13", name: "叢林 Pip", avatar: "🐵" },
    { id: "r14", name: "珊瑚 Eve", avatar: "🐙" },
    { id: "r15", name: "晨露 Kim", avatar: "🌸" },
  ];

  var REPLY_KEYS = [
    "flow.friendReply1",
    "flow.friendReply2",
    "flow.friendReply3",
    "flow.friendReply4",
    "flow.friendReply5",
  ];

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function scopeId() {
    if (global.RNFPlayerAuth && RNFPlayerAuth.getCurrentUser) {
      var u = RNFPlayerAuth.getCurrentUser();
      if (u && u.id) return u.id;
    }
    return "guest";
  }

  function friendsStorageKey() {
    return FRIENDS_KEY + "_" + scopeId();
  }

  function loadFriends() {
    try {
      var raw = localStorage.getItem(friendsStorageKey());
      if (raw) {
        var arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      }
    } catch (e) {}
    return [];
  }

  function saveFriends(list) {
    try {
      localStorage.setItem(friendsStorageKey(), JSON.stringify(list));
    } catch (e) {}
    try {
      document.dispatchEvent(new CustomEvent("rnf:friends-change"));
    } catch (e2) {}
  }

  function findInDirectory(name) {
    var q = String(name || "").trim().toLowerCase();
    if (!q) return null;
    for (var i = 0; i < DIRECTORY.length; i++) {
      if (DIRECTORY[i].name.toLowerCase() === q) return DIRECTORY[i];
    }
    for (var j = 0; j < DIRECTORY.length; j++) {
      if (DIRECTORY[j].name.toLowerCase().indexOf(q) >= 0) return DIRECTORY[j];
    }
    return null;
  }

  function getDirectory() {
    return DIRECTORY.slice();
  }

  function addFriendByName(name) {
    var entry = findInDirectory(name);
    if (!entry) return { ok: false, reason: "not_found" };
    var list = loadFriends();
    if (
      list.some(function (f) {
        return f.id === entry.id;
      })
    ) {
      return { ok: false, reason: "already" };
    }
    list.push({
      id: entry.id,
      name: entry.name,
      avatar: entry.avatar,
      addedAt: Date.now(),
    });
    saveFriends(list);
    touchPresence(entry.id, true);
    return { ok: true, friend: entry };
  }

  function removeFriend(id) {
    var list = loadFriends().filter(function (f) {
      return f.id !== id;
    });
    saveFriends(list);
  }

  function isFriend(id) {
    return loadFriends().some(function (f) {
      return f.id === id;
    });
  }

  function getFriendIds() {
    return loadFriends().map(function (f) {
      return f.id;
    });
  }

  function touchPresence(friendId, online) {
    try {
      localStorage.setItem(
        PRESENCE_PREFIX + friendId,
        JSON.stringify({
          online: !!online,
          at: Date.now(),
        })
      );
    } catch (e) {}
  }

  function isOnline(friendId) {
    try {
      var raw = localStorage.getItem(PRESENCE_PREFIX + friendId);
      if (!raw) {
        var h = 0;
        var s = friendId + String(Math.floor(Date.now() / 60000));
        for (var i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
        return Math.abs(h) % 3 !== 0;
      }
      var p = JSON.parse(raw);
      if (p.online) return Date.now() - (p.at || 0) < 15 * 60 * 1000;
      return false;
    } catch (e) {
      return false;
    }
  }

  function chatKey(friendId) {
    return CHAT_PREFIX + scopeId() + "_" + friendId;
  }

  function loadChat(friendId) {
    try {
      var raw = localStorage.getItem(chatKey(friendId));
      if (raw) {
        var arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      }
    } catch (e) {}
    return [];
  }

  function saveChat(friendId, messages) {
    try {
      localStorage.setItem(chatKey(friendId), JSON.stringify(messages.slice(-80)));
    } catch (e) {}
  }

  function pickReply(friendId) {
    var h = 0;
    for (var i = 0; i < friendId.length; i++) h += friendId.charCodeAt(i);
    return t(REPLY_KEYS[h % REPLY_KEYS.length]);
  }

  function sendMessage(friendId, text) {
    var body = String(text || "").trim();
    if (!body) return { ok: false };
    if (!isFriend(friendId)) return { ok: false, reason: "not_friend" };
    var msgs = loadChat(friendId);
    msgs.push({
      id: "m_" + Date.now(),
      from: "me",
      text: body,
      ts: Date.now(),
    });
    saveChat(friendId, msgs);
    touchPresence(friendId, true);
    scheduleReply(friendId);
    return { ok: true, messages: msgs };
  }

  var replyTimers = {};

  function scheduleReply(friendId) {
    if (replyTimers[friendId]) clearTimeout(replyTimers[friendId]);
    replyTimers[friendId] = setTimeout(function () {
      var msgs = loadChat(friendId);
      msgs.push({
        id: "m_" + Date.now(),
        from: "friend",
        text: pickReply(friendId),
        ts: Date.now(),
      });
      saveChat(friendId, msgs);
      touchPresence(friendId, true);
      try {
        document.dispatchEvent(
          new CustomEvent("rnf:friend-chat", { detail: { friendId: friendId } })
        );
      } catch (e) {}
    }, 900 + Math.floor(Math.random() * 1200));
  }

  function searchNames(query) {
    var q = String(query || "").trim().toLowerCase();
    if (!q) return [];
    return DIRECTORY.filter(function (d) {
      return d.name.toLowerCase().indexOf(q) >= 0;
    }).slice(0, 8);
  }

  function getFriendLeaderboardEntries(mode) {
    var api = global.RNFLeaderboardData;
    if (!api || !api.buildRankings) return [];
    var data = api.buildRankings(mode || "xp");
    var ids = getFriendIds();
    return data.list.filter(function (e) {
      return ids.indexOf(e.id) >= 0;
    });
  }

  global.RNFriends = {
    DIRECTORY: DIRECTORY,
    loadFriends: loadFriends,
    addFriendByName: addFriendByName,
    removeFriend: removeFriend,
    isFriend: isFriend,
    getFriendIds: getFriendIds,
    isOnline: isOnline,
    loadChat: loadChat,
    sendMessage: sendMessage,
    searchNames: searchNames,
    getDirectory: getDirectory,
    findInDirectory: findInDirectory,
    getFriendLeaderboardEntries: getFriendLeaderboardEntries,
  };
})(typeof window !== "undefined" ? window : this);
