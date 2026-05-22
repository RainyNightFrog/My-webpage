/**
 * Player accounts — register, login, permanent local saves (per user).
 */
(function (global) {
  var SESSION_KEY = "rnf_active_user_id";
  var INDEX_KEY = "rnf_account_index";
  var SAVE_PREFIX = "rnf_save_";
  var ACCOUNT_PREFIX = "rnf_account_";
  var SAVE_VERSION = 1;

  var persistTimer = null;

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function normalizeEmail(email) {
    return String(email || "")
      .trim()
      .toLowerCase();
  }

  function uid() {
    return "u_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
  }

  function hashPassword(password, salt) {
    var str = salt + "::" + password;
    if (global.crypto && crypto.subtle && crypto.subtle.digest) {
      return crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(str))
        .then(function (buf) {
          return Array.from(new Uint8Array(buf))
            .map(function (b) {
              return b.toString(16).padStart(2, "0");
            })
            .join("");
        });
    }
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return Promise.resolve("h" + Math.abs(h).toString(16) + str.length);
  }

  function loadIndex() {
    try {
      var raw = localStorage.getItem(INDEX_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveIndex(index) {
    try {
      localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    } catch (e) {}
  }

  function getSessionUserId() {
    try {
      return localStorage.getItem(SESSION_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setSessionUserId(id) {
    try {
      if (id) localStorage.setItem(SESSION_KEY, id);
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function isGameKey(key) {
    if (!key || key.indexOf("rnf_") !== 0) return false;
    if (key === SESSION_KEY || key === INDEX_KEY) return false;
    if (key.indexOf(SAVE_PREFIX) === 0) return false;
    if (key.indexOf(ACCOUNT_PREFIX) === 0) return false;
    return true;
  }

  function collectLocalSnapshot() {
    var blob = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || !isGameKey(key)) continue;
        blob[key] = localStorage.getItem(key);
      }
    } catch (e) {}
    return blob;
  }

  function applySnapshot(blob) {
    if (!blob) return;
    Object.keys(blob).forEach(function (key) {
      try {
        if (blob[key] == null) localStorage.removeItem(key);
        else localStorage.setItem(key, blob[key]);
      } catch (e) {}
    });
  }

  function loadUserSave(userId) {
    try {
      var raw = localStorage.getItem(SAVE_PREFIX + userId);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveUserSave(userId, blob) {
    try {
      localStorage.setItem(
        SAVE_PREFIX + userId,
        JSON.stringify({
          version: SAVE_VERSION,
          updatedAt: Date.now(),
          data: blob,
        })
      );
    } catch (e) {}
  }

  function loadAccount(userId) {
    try {
      var raw = localStorage.getItem(ACCOUNT_PREFIX + userId);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveAccount(account) {
    try {
      localStorage.setItem(ACCOUNT_PREFIX + account.id, JSON.stringify(account));
    } catch (e) {}
  }

  function isLoggedIn() {
    var id = getSessionUserId();
    return !!(id && loadAccount(id));
  }

  function getCurrentUser() {
    var id = getSessionUserId();
    if (!id) return null;
    return loadAccount(id);
  }

  function persistNow() {
    var userId = getSessionUserId();
    if (!userId) return;
    saveUserSave(userId, collectLocalSnapshot());
  }

  function schedulePersist() {
    if (!getSessionUserId()) return;
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(persistNow, 400);
  }

  function installPersistenceHooks() {
    if (localStorage.__rnfPatched) return;
    localStorage.__rnfPatched = true;
    var origSet = localStorage.setItem.bind(localStorage);
    var origRemove = localStorage.removeItem.bind(localStorage);

    localStorage.setItem = function (key, value) {
      origSet(key, value);
      if (isGameKey(key) && getSessionUserId()) schedulePersist();
    };

    localStorage.removeItem = function (key) {
      origRemove(key);
      if (isGameKey(key) && getSessionUserId()) schedulePersist();
    };

    global.addEventListener("beforeunload", function () {
      persistNow();
    });
  }

  function afterLogin(userId) {
    setSessionUserId(userId);
    var save = loadUserSave(userId);
    if (save && save.data) {
      applySnapshot(save.data);
    }
    try {
      localStorage.setItem("rnf_profile_created", "1");
    } catch (e) {}
    if (global.document && document.dispatchEvent) {
      document.dispatchEvent(new CustomEvent("rnf:auth-change"));
      document.dispatchEvent(new CustomEvent("lc:heartschange"));
    }
    if (global.LCApp && LCApp.refreshProfileNavIcon) {
      LCApp.refreshProfileNavIcon();
    }
  }

  function register(opts) {
    opts = opts || {};
    var email = normalizeEmail(opts.email);
    var password = opts.password || "";
    var name = (opts.name || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Promise.resolve({ ok: false, reason: "email" });
    }
    if (password.length < 6) {
      return Promise.resolve({ ok: false, reason: "password" });
    }

    var index = loadIndex();
    if (index[email]) {
      return Promise.resolve({ ok: false, reason: "exists" });
    }

    var id = uid();
    var salt = Math.random().toString(36).slice(2, 12);

    return hashPassword(password, salt).then(function (hash) {
      var account = {
        id: id,
        email: email,
        name: name,
        salt: salt,
        passwordHash: hash,
        createdAt: Date.now(),
      };
      index[email] = id;
      saveIndex(index);
      saveAccount(account);

      var snapshot = collectLocalSnapshot();
      saveUserSave(id, snapshot);

      try {
        localStorage.setItem(
          "rnf_profile",
          JSON.stringify({ name: name, email: email })
        );
        localStorage.setItem("rnf_profile_joined", new Date().toISOString());
        if (opts.age) localStorage.setItem("rnf_profile_age", String(opts.age));
      } catch (e) {}

      afterLogin(id);
      return { ok: true, userId: id, account: account };
    });
  }

  function login(email, password) {
    email = normalizeEmail(email);
    var index = loadIndex();
    var userId = index[email];
    if (!userId) {
      return Promise.resolve({ ok: false, reason: "notfound" });
    }
    var account = loadAccount(userId);
    if (!account) {
      return Promise.resolve({ ok: false, reason: "notfound" });
    }

    return hashPassword(password, account.salt).then(function (hash) {
      if (hash !== account.passwordHash) {
        return { ok: false, reason: "password" };
      }
      afterLogin(userId);
      return { ok: true, userId: userId, account: account };
    });
  }

  function logout() {
    persistNow();
    setSessionUserId("");
    if (global.document && document.dispatchEvent) {
      document.dispatchEvent(new CustomEvent("rnf:auth-change"));
    }
    if (global.LCApp && LCApp.refreshProfileNavIcon) {
      LCApp.refreshProfileNavIcon();
    }
  }

  function initSession() {
    installPersistenceHooks();
    var userId = getSessionUserId();
    if (!userId) return;
    var account = loadAccount(userId);
    if (!account) {
      setSessionUserId("");
      return;
    }
    var save = loadUserSave(userId);
    if (save && save.data) {
      applySnapshot(save.data);
    }
    try {
      localStorage.setItem("rnf_profile_created", "1");
    } catch (e) {}
  }

  global.RNFPlayerAuth = {
    register: register,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    getCurrentUser: getCurrentUser,
    persistNow: persistNow,
    initSession: initSession,
    normalizeEmail: normalizeEmail,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSession);
  } else {
    initSession();
  }
})(typeof window !== "undefined" ? window : this);
