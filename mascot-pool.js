/**
 * 練習題動物夥伴：每題不同、鮮艷可愛
 */
(function (global) {
  var POOL = [
    { id: "frog", emoji: "🐸", theme: "frog", decor: "🌿", name: "青蛙" },
    { id: "fox", emoji: "🦊", theme: "fox", decor: "🍂", name: "狐狸" },
    { id: "cat", emoji: "🐱", theme: "cat", decor: "🐟", name: "小貓" },
    { id: "dog", emoji: "🐶", theme: "dog", decor: "🦴", name: "小狗" },
    { id: "rabbit", emoji: "🐰", theme: "rabbit", decor: "🥕", name: "兔子" },
    { id: "panda", emoji: "🐼", theme: "panda", decor: "🎋", name: "熊貓" },
    { id: "koala", emoji: "🐨", theme: "koala", decor: "🌙", name: "無尾熊" },
    { id: "tiger", emoji: "🐯", theme: "tiger", decor: "🔥", name: "老虎" },
    { id: "lion", emoji: "🦁", theme: "lion", decor: "👑", name: "獅子" },
    { id: "monkey", emoji: "🐵", theme: "monkey", decor: "🍌", name: "猴子" },
    { id: "pig", emoji: "🐷", theme: "pig", decor: "🌸", name: "小豬" },
    { id: "chick", emoji: "🐥", theme: "chick", decor: "⭐", name: "小雞" },
    { id: "duck", emoji: "🦆", theme: "duck", decor: "💧", name: "鴨子" },
    { id: "owl", emoji: "🦉", theme: "owl", decor: "📚", name: "貓頭鷹" },
    { id: "bear", emoji: "🐻", theme: "bear", decor: "🍯", name: "小熊" },
    { id: "penguin", emoji: "🐧", theme: "penguin", decor: "❄️", name: "企鵝" },
    { id: "unicorn", emoji: "🦄", theme: "unicorn", decor: "✨", name: "獨角獸" },
    { id: "butterfly", emoji: "🦋", theme: "butterfly", decor: "🌺", name: "蝴蝶" },
    { id: "bee", emoji: "🐝", theme: "bee", decor: "🌻", name: "蜜蜂" },
    { id: "turtle", emoji: "🐢", theme: "turtle", decor: "🫧", name: "烏龜" },
    { id: "whale", emoji: "🐳", theme: "whale", decor: "🌊", name: "鯨魚" },
    { id: "dragon", emoji: "🐲", theme: "dragon", decor: "🏮", name: "小龍" },
    { id: "hamster", emoji: "🐹", theme: "hamster", decor: "🥜", name: "倉鼠" },
    { id: "deer", emoji: "🦌", theme: "deer", decor: "🍀", name: "小鹿" },
    { id: "octopus", emoji: "🐙", theme: "octopus", decor: "🐚", name: "章魚" },
    { id: "parrot", emoji: "🦜", theme: "parrot", decor: "🌴", name: "鸚鵡" },
    { id: "crab", emoji: "🦀", theme: "crab", decor: "🏖️", name: "螃蟹" },
    { id: "snail", emoji: "🐌", theme: "snail", decor: "🌧️", name: "蝸牛" },
    { id: "mouse", emoji: "🐭", theme: "mouse", decor: "🧀", name: "小老鼠" },
    { id: "wolf", emoji: "🐺", theme: "wolf", decor: "🌕", name: "狼" },
  ];

  function hashStr(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function byId(id) {
    for (var i = 0; i < POOL.length; i++) {
      if (POOL[i].id === id) return POOL[i];
    }
    return POOL[0];
  }

  function pick(q, slot, usedMap) {
    if (q && q.mascotId) return byId(q.mascotId);
    var key =
      (q && q.vocabKey ? q.vocabKey : "") +
      "|" +
      (q && q.id ? q.id : "q") +
      "|" +
      String(slot != null ? slot : 0);
    var start = hashStr(key) % POOL.length;
    if (!usedMap) return POOL[start];
    for (var n = 0; n < POOL.length; n++) {
      var m = POOL[(start + n) % POOL.length];
      if (!usedMap[m.id]) {
        usedMap[m.id] = true;
        return m;
      }
    }
    return POOL[start];
  }

  function html(q, slot, usedMap) {
    var m = pick(q, slot, usedMap);
    return (
      '<div class="lc-mascot lc-mascot--animal lc-mascot--' +
      m.theme +
      '" role="img" aria-label="' +
      m.name +
      '">' +
      '<span class="lc-mascot-ring" aria-hidden="true"></span>' +
      '<span class="lc-mascot-emoji" aria-hidden="true">' +
      m.emoji +
      "</span>" +
      (m.decor
        ? '<span class="lc-mascot-decor" aria-hidden="true">' + m.decor + "</span>"
        : "") +
      "</div>"
    );
  }

  function applyToQuestion(q, slot, usedMap) {
    if (!q) return q;
    var m = pick(q, slot, usedMap);
    q.mascotId = m.id;
    q.avatar = m.emoji;
    q.avatarClass = m.theme;
    return q;
  }

  global.RNFMascot = {
    POOL: POOL,
    pick: pick,
    html: html,
    apply: applyToQuestion,
    byId: byId,
  };
})(window);
