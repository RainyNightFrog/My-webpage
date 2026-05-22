/**
 * Profile avatar frame presets — Rainy Night Frog
 */
(function (global) {
  var FRAMES = [
    { id: "classic", labelKey: "flow.frameClassic", className: "lc-frame-classic" },
    { id: "gold", labelKey: "flow.frameGold", className: "lc-frame-gold" },
    { id: "neon", labelKey: "flow.frameNeon", className: "lc-frame-neon" },
    { id: "rainbow", labelKey: "flow.frameRainbow", className: "lc-frame-rainbow" },
    { id: "cosmic", labelKey: "flow.frameCosmic", className: "lc-frame-cosmic" },
    { id: "crown", labelKey: "flow.frameCrown", className: "lc-frame-crown" },
    { id: "horror", labelKey: "flow.frameHorror", className: "lc-frame-horror" },
    { id: "alien", labelKey: "flow.frameAlien", className: "lc-frame-alien" },
    { id: "floral", labelKey: "flow.frameFloral", className: "lc-frame-floral" },
    { id: "crystal", labelKey: "flow.frameCrystal", className: "lc-frame-crystal" },
  ];

  function getFrameId() {
    try {
      var id = localStorage.getItem("rnf_avatar_frame");
      if (id && byId(id)) return id;
    } catch (e) {}
    return "classic";
  }

  function setFrameId(id) {
    if (!byId(id)) id = "classic";
    try {
      localStorage.setItem("rnf_avatar_frame", id);
    } catch (e) {}
  }

  function byId(id) {
    for (var i = 0; i < FRAMES.length; i++) {
      if (FRAMES[i].id === id) return FRAMES[i];
    }
    return null;
  }

  function frameClassFor(id) {
    var f = byId(id || getFrameId());
    return f ? f.className : "lc-frame-classic";
  }

  global.RNFAvatarFrames = {
    FRAMES: FRAMES,
    getFrameId: getFrameId,
    setFrameId: setFrameId,
    byId: byId,
    frameClassFor: frameClassFor,
  };
})(typeof window !== "undefined" ? window : this);
