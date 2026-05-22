/**
 * Leaderboard — open rankings, podium, highlights.
 */
(function (global) {
  var COURSE_KEYS = {
    en: "flow.courseEn",
    es: "flow.courseEs",
    fr: "flow.courseFr",
    ja: "flow.courseJa",
    zh: "flow.courseZh",
    de: "flow.courseDe",
    ko: "flow.courseKo",
    it: "flow.courseIt",
    pt: "flow.coursePt",
  };

  var LANG_FLAGS = {
    en: "🇺🇸",
    es: "🇪🇸",
    fr: "🇫🇷",
    ja: "🇯🇵",
    zh: "🇨🇳",
    de: "🇩🇪",
    ko: "🇰🇷",
    it: "🇮🇹",
    pt: "🇧🇷",
  };

  var state = { tab: "xp" };

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function dataApi() {
    return global.RNFLeaderboardData;
  }

  function rankTitle(rank) {
    if (rank === 1) return t("flow.lbRank1Title");
    if (rank === 2) return t("flow.lbRank2Title");
    if (rank === 3) return t("flow.lbRank3Title");
    return "";
  }

  function rankCrown(rank) {
    if (rank === 1) return "👑";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return String(rank);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderPodium(top3, mode, me) {
    var api = dataApi();
    if (!api) return "";
    var order = [top3[1], top3[0], top3[2]];
    var slots = [2, 1, 3];
    var html =
      '<section class="lc-lb-podium" aria-label="' +
      escapeHtml(t("flow.lbPodiumLabel")) +
      '">';
    order.forEach(function (entry, idx) {
      if (!entry) return;
      var rank = slots[idx];
      var isMe = entry.isMe;
      var diff =
        !isMe && me && api.diffFromMe
          ? api.diffFromMe(entry, mode, me)
          : 0;
      html +=
        '<article class="lc-lb-podium-slot lc-lb-podium-slot--' +
        rank +
        (isMe ? " is-me" : "") +
        '">' +
        '<div class="lc-lb-podium-glow" aria-hidden="true"></div>' +
        '<span class="lc-lb-podium-crown" aria-hidden="true">' +
        rankCrown(rank) +
        "</span>" +
        '<div class="lc-lb-podium-avatar">' +
        '<span class="lc-lb-podium-emoji">' +
        entry.avatar +
        "</span></div>" +
        '<p class="lc-lb-podium-rank-label">' +
        escapeHtml(rankTitle(rank)) +
        "</p>" +
        '<p class="lc-lb-podium-name">' +
        escapeHtml(entry.name) +
        (isMe
          ? ' <span class="lc-lb-you-badge">' + escapeHtml(t("flow.lbYou")) + "</span>"
          : "") +
        "</p>" +
        '<p class="lc-lb-podium-score">' +
        escapeHtml(api.formatMetric(entry, mode)) +
        "</p>";
      if (diff > 0 && !isMe) {
        html +=
          '<p class="lc-lb-podium-gap">' +
          escapeHtml(t("flow.lbVsYou", { n: diff })) +
          "</p>";
      }
      html += "</article>";
    });
    html += "</section>";
    return html;
  }

  function renderRow(entry, mode, me) {
    var api = dataApi();
    var diff =
      !entry.isMe && me && api && api.diffFromMe
        ? api.diffFromMe(entry, mode, me)
        : 0;
    return (
      '<li class="lc-lb-row' +
      (entry.isMe ? " is-me" : "") +
      '">' +
      '<span class="lc-lb-row-rank">' +
      entry.rank +
      "</span>" +
      '<span class="lc-lb-row-avatar" aria-hidden="true">' +
      entry.avatar +
      "</span>" +
      '<div class="lc-lb-row-body">' +
      '<span class="lc-lb-row-name">' +
      escapeHtml(entry.name) +
      (entry.isMe
        ? ' <span class="lc-lb-you-badge">' + escapeHtml(t("flow.lbYou")) + "</span>"
        : "") +
      (entry.isFriend
        ? ' <span class="lc-lb-friend-badge">' + escapeHtml(t("flow.lbFriend")) + "</span>"
        : "") +
      "</span>" +
      (diff > 0
        ? '<span class="lc-lb-row-gap">' +
          escapeHtml(t("flow.lbVsYou", { n: diff })) +
          "</span>"
        : "") +
      "</div>" +
      '<span class="lc-lb-row-metric">' +
      escapeHtml(api.formatMetric(entry, mode)) +
      "</span></li>"
    );
  }

  function renderRankList(data) {
    var list = data.list;
    var rest = list.slice(3);
    if (!rest.length) return "";
    var html = '<ol class="lc-lb-rank-list">';
    rest.forEach(function (entry) {
      html += renderRow(entry, data.mode, data.me);
    });
    html += "</ol>";
    return html;
  }

  function renderYourCard(data) {
    if (!data.me) return "";
    return (
      '<div class="lc-lb-your-card">' +
      '<span class="lc-lb-your-label">' +
      escapeHtml(t("flow.lbYourRank")) +
      "</span>" +
      '<span class="lc-lb-your-rank">#' +
      data.me.rank +
      "</span>" +
      '<span class="lc-lb-your-metric">' +
      escapeHtml(dataApi().formatMetric(data.me, data.mode)) +
      "</span></div>"
    );
  }

  function renderTabs() {
    var tabs = [
      { id: "xp", key: "flow.lbTabXp" },
      { id: "gems", key: "flow.lbTabGems" },
      { id: "progress", key: "flow.lbTabProgress" },
    ];
    var html =
      '<div class="lc-lb-tabs" role="tablist" aria-label="' +
      escapeHtml(t("flow.lbTabsLabel")) +
      '">';
    tabs.forEach(function (tab) {
      html +=
        '<button type="button" class="lc-lb-tab' +
        (state.tab === tab.id ? " on" : "") +
        '" role="tab" aria-selected="' +
        (state.tab === tab.id ? "true" : "false") +
        '" data-lb-tab="' +
        tab.id +
        '">' +
        escapeHtml(t(tab.key)) +
        "</button>";
    });
    html += "</div>";
    return html;
  }

  function renderFriendsBoard() {
    var api = dataApi();
    if (!api || !api.buildFriendRankings || !global.RNFriends) return "";
    var friends = RNFriends.loadFriends();
    if (!friends.length) {
      return (
        '<section class="lc-lb-friends">' +
        "<h2>" +
        escapeHtml(t("flow.lbFriendsTitle")) +
        "</h2>" +
        '<p class="lc-lb-friends-empty">' +
        escapeHtml(t("flow.lbFriendsEmpty")) +
        ' <a href="friends.html">' +
        escapeHtml(t("flow.lbFriendsGoAdd")) +
        "</a></p></section>"
      );
    }
    var data = api.buildFriendRankings(state.tab);
    var html =
      '<section class="lc-lb-friends">' +
      "<h2>" +
      escapeHtml(t("flow.lbFriendsTitle")) +
      "</h2>" +
      '<p class="lc-lb-friends-sub">' +
      escapeHtml(t("flow.lbFriendsSub")) +
      "</p>" +
      '<ol class="lc-lb-rank-list lc-lb-rank-list--friends">';
    data.list.forEach(function (entry) {
      html += renderRow(entry, data.mode, data.me);
    });
    html += "</ol></section>";
    return html;
  }

  function renderMainBoard() {
    var api = dataApi();
    if (!api) {
      return '<p class="lc-lb-error">' + escapeHtml(t("flow.lbLoadError")) + "</p>";
    }
    var data = api.buildRankings(state.tab);
    var top3 = data.list.slice(0, 3);
    return (
      '<div class="lc-lb-live">' +
      '<header class="lc-lb-live-header">' +
      "<h1>" +
      escapeHtml(t("flow.lbLiveTitle")) +
      "</h1>" +
      '<p class="lc-lb-live-sub">' +
      escapeHtml(t("flow.lbLiveSub")) +
      "</p>" +
      '<span class="lc-lb-week-pill">' +
      escapeHtml(t("flow.lbThisWeek")) +
      "</span></header>" +
      renderTabs() +
      renderYourCard(data) +
      renderFriendsBoard() +
      renderPodium(top3, state.tab, data.me) +
      renderRankList(data) +
      "</div>"
    );
  }

  function renderHighlights() {
    var api = dataApi();
    var items = api ? api.getHighlights() : [];
    var html =
      '<div class="lc-lb-highlight-panel">' +
      "<h2>" +
      escapeHtml(t("flow.lbHighlights")) +
      "</h2>";
    if (!items.length) {
      html +=
        '<p class="lc-lb-highlight-empty">' +
        escapeHtml(t("flow.lbHighlightEmpty")) +
        "</p>";
    } else {
      html += '<ul class="lc-lb-highlight-list">';
      items.slice(0, 8).forEach(function (h) {
        html +=
          '<li class="lc-lb-highlight-item">' +
          '<span class="lc-lb-highlight-emoji" aria-hidden="true">' +
          (h.emoji || "✨") +
          "</span>" +
          '<div class="lc-lb-highlight-text">' +
          "<strong>" +
          escapeHtml(api.highlightText(h, "title")) +
          "</strong>";
        var detail = api.highlightText(h, "detail");
        if (detail) {
          html += "<span>" + escapeHtml(detail) + "</span>";
        }
        html += "</div></li>";
      });
      html += "</ul>";
    }
    html += "</div>";
    return html;
  }

  function renderTipCard() {
    return (
      '<div class="lc-lb-tip-card">' +
      '<div class="lc-lb-tip-mascot" aria-hidden="true">' +
      '<span class="lc-lb-headband">🎽</span>' +
      '<div class="lc-lb-frog" data-frog-logo></div>' +
      '<span class="lc-lb-dumbbell">🏋️</span></div>' +
      "<h2>" +
      t("flow.leaderboardHowTitle") +
      "</h2>" +
      '<p class="lc-lb-tip-tagline">' +
      t("flow.leaderboardHowTagline") +
      "</p>" +
      '<p class="lc-lb-tip-desc">' +
      t("flow.leaderboardHowDesc") +
      "</p></div>"
    );
  }

  function bindTabs() {
    document.querySelectorAll("[data-lb-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.tab = btn.getAttribute("data-lb-tab") || "xp";
        var main = document.getElementById("leaderboardMain");
        if (main) main.innerHTML = renderMainBoard();
        bindTabs();
      });
    });
  }

  function init() {
    var main = document.getElementById("leaderboardMain");
    var aside = document.getElementById("leaderboardAside");

    if (main) {
      main.innerHTML = renderMainBoard();
      bindTabs();
    }

    if (aside) {
      aside.innerHTML = renderTipCard() + renderHighlights();
    }

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    if (global.LCApp && LCApp.syncLearnCourseLabel) LCApp.syncLearnCourseLabel();

    var langLbl = document.querySelector("[data-learn-lang-label]");
    if (langLbl && global.LCApp && !LCApp.syncLearnCourseLabel) {
      var target = LCApp.getLearnTarget();
      langLbl.textContent =
        (LANG_FLAGS[target] || "") +
        " " +
        t(COURSE_KEYS[target] || "flow.courseEn");
    }
  }

  global.RNFLeaderboard = {
    init: init,
    setTab: function (tab) {
      state.tab = tab;
      init();
    },
  };
})(typeof window !== "undefined" ? window : this);
