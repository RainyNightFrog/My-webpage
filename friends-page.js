/**
 * Friends page — add by name, chat panel
 */
(function (global) {
  var activeFriendId = null;

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderFriendList() {
    if (!global.RNFriends) return "";
    var friends = RNFriends.loadFriends();
    if (!friends.length) {
      return (
        '<p class="lc-friends-empty">' + escapeHtml(t("flow.friendsEmpty")) + "</p>"
      );
    }
    var html = '<ul class="lc-friends-list">';
    friends.forEach(function (f) {
      var on = RNFriends.isOnline(f.id);
      html +=
        '<li><button type="button" class="lc-friends-item' +
        (activeFriendId === f.id ? " active" : "") +
        '" data-friend-id="' +
        escapeHtml(f.id) +
        '">' +
        '<span class="lc-friends-avatar" aria-hidden="true">' +
        f.avatar +
        "</span>" +
        '<span class="lc-friends-item-body">' +
        '<span class="lc-friends-name">' +
        escapeHtml(f.name) +
        "</span>" +
        '<span class="lc-friends-status' +
        (on ? " online" : "") +
        '">' +
        (on ? escapeHtml(t("flow.friendsOnline")) : escapeHtml(t("flow.friendsOffline"))) +
        "</span></span></button></li>";
    });
    html += "</ul>";
    return html;
  }

  function renderChat(friendId) {
    if (!friendId || !global.RNFriends) {
      return (
        '<div class="lc-friends-chat lc-friends-chat--empty">' +
        '<p>' +
        escapeHtml(t("flow.friendsPickChat")) +
        "</p></div>"
      );
    }
    var friends = RNFriends.loadFriends();
    var f = friends.filter(function (x) {
      return x.id === friendId;
    })[0];
    if (!f) return "";
    var msgs = RNFriends.loadChat(friendId);
    var on = RNFriends.isOnline(friendId);
    var bubbles = "";
    msgs.forEach(function (m) {
      bubbles +=
        '<div class="lc-friends-msg lc-friends-msg--' +
        (m.from === "me" ? "me" : "them") +
        '">' +
        escapeHtml(m.text) +
        "</div>";
    });
    return (
      '<div class="lc-friends-chat" data-chat-panel>' +
      '<header class="lc-friends-chat-head">' +
      '<span class="lc-friends-chat-avatar" aria-hidden="true">' +
      f.avatar +
      "</span>" +
      '<div class="lc-friends-chat-meta">' +
      "<strong>" +
      escapeHtml(f.name) +
      "</strong>" +
      '<span class="lc-friends-status' +
      (on ? " online" : "") +
      '">' +
      (on ? escapeHtml(t("flow.friendsOnline")) : escapeHtml(t("flow.friendsOffline"))) +
      "</span></div>" +
      '<button type="button" class="lc-friends-remove" data-remove-friend="' +
      escapeHtml(f.id) +
      '" title="' +
      escapeHtml(t("flow.friendsRemove")) +
      '">×</button></header>' +
      '<div class="lc-friends-messages" id="friendsMessages">' +
      bubbles +
      "</div>" +
      '<form class="lc-friends-compose" id="friendsCompose">' +
      '<input type="text" id="friendsChatInput" maxlength="280" placeholder="' +
      escapeHtml(t("flow.friendsChatPlaceholder")) +
      '" autocomplete="off" />' +
      '<button type="submit" class="lc-btn-primary">' +
      escapeHtml(t("flow.friendsSend")) +
      "</button></form></div>"
    );
  }

  function render() {
    var root = document.getElementById("friendsMain");
    if (!root) return;
    root.innerHTML =
      '<header class="lc-friends-head">' +
      "<h1>" +
      escapeHtml(t("flow.friendsTitle")) +
      "</h1>" +
      '<p class="lc-friends-sub">' +
      escapeHtml(t("flow.friendsSub")) +
      "</p></header>" +
      '<div class="lc-friends-add">' +
      '<label for="friendsAddInput">' +
      escapeHtml(t("flow.friendsAddLabel")) +
      "</label>" +
      '<div class="lc-friends-add-row">' +
      '<input type="text" id="friendsAddInput" placeholder="' +
      escapeHtml(t("flow.friendsAddPlaceholder")) +
      '" autocomplete="off" />' +
      '<button type="button" class="lc-btn-primary" id="friendsAddBtn">' +
      escapeHtml(t("flow.friendsAddBtn")) +
      "</button></div>" +
      '<p class="lc-friends-add-hint" id="friendsAddHint"></p></div>' +
      '<div class="lc-friends-layout">' +
      '<aside class="lc-friends-sidebar" id="friendsSidebar">' +
      renderFriendList() +
      "</aside>" +
      '<div class="lc-friends-main" id="friendsChatMount">' +
      renderChat(activeFriendId) +
      "</div></div>";

    bindEvents();
    scrollChatBottom();
  }

  function scrollChatBottom() {
    var box = document.getElementById("friendsMessages");
    if (box) box.scrollTop = box.scrollHeight;
  }

  function showHint(msg, ok) {
    var el = document.getElementById("friendsAddHint");
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("ok", !!ok);
    el.classList.toggle("err", !ok && !!msg);
  }

  function bindEvents() {
    var addBtn = document.getElementById("friendsAddBtn");
    var addInput = document.getElementById("friendsAddInput");
    if (addBtn && addInput) {
      addBtn.addEventListener("click", tryAddFriend);
      addInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") tryAddFriend();
      });
    }

    document.querySelectorAll("[data-friend-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeFriendId = btn.getAttribute("data-friend-id");
        render();
      });
    });

    var removeBtn = document.querySelector("[data-remove-friend]");
    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        var id = removeBtn.getAttribute("data-remove-friend");
        if (global.RNFriends) RNFriends.removeFriend(id);
        if (activeFriendId === id) activeFriendId = null;
        render();
      });
    }

    var form = document.getElementById("friendsCompose");
    var chatInput = document.getElementById("friendsChatInput");
    if (form && chatInput && activeFriendId) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!global.RNFriends) return;
        RNFriends.sendMessage(activeFriendId, chatInput.value);
        chatInput.value = "";
        var chatMount = document.getElementById("friendsChatMount");
        if (chatMount) chatMount.innerHTML = renderChat(activeFriendId);
        bindEvents();
        scrollChatBottom();
      });
    }
  }

  function tryAddFriend() {
    var input = document.getElementById("friendsAddInput");
    if (!input || !global.RNFriends) return;
    var res = RNFriends.addFriendByName(input.value);
    if (!res.ok) {
      if (res.reason === "already") {
        showHint(t("flow.friendsAlready"), false);
      } else {
        showHint(t("flow.friendsNotFound"), false);
      }
      return;
    }
    showHint(t("flow.friendsAdded", { name: res.friend.name }), true);
    input.value = "";
    activeFriendId = res.friend.id;
    render();
  }

  function init() {
    if (!activeFriendId) {
      var list = global.RNFriends ? RNFriends.loadFriends() : [];
      if (list.length) activeFriendId = list[0].id;
    }
    render();
    document.addEventListener("rnf:friend-chat", function (e) {
      if (!e.detail || e.detail.friendId !== activeFriendId) return;
      var chatMount = document.getElementById("friendsChatMount");
      if (chatMount) chatMount.innerHTML = renderChat(activeFriendId);
      bindEvents();
      scrollChatBottom();
    });
    document.addEventListener("rnf:friends-change", function () {
      render();
    });
  }

  global.RNFFriendsPage = { init: init };
})(typeof window !== "undefined" ? window : this);
