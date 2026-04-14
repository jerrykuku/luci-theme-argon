(function () {
  "use strict";

  function focusPasswordInput() {
    var input = document.getElementById("cbi-input-password");
    if (input) input.focus();
  }

  function applyBackgroundImageFromDataAttribute() {
    var mainBg = document.getElementById("main-bg");
    if (!mainBg) return;

    var bgUrl = mainBg.getAttribute("data-bg-url");
    if (!bgUrl) return;

    mainBg.style.backgroundImage = 'url("' + bgUrl.replace(/"/g, '\\"') + '")';
  }

  function bindVideoVolumeToggle() {
    var volumeControl = document.querySelector(".volume-control");
    var video = document.getElementById("video");
    if (!volumeControl || !video) return;

    var muteLabel = volumeControl.getAttribute("data-label-mute") || "Mute background video";
    var unmuteLabel = volumeControl.getAttribute("data-label-unmute") || "Unmute background video";

    volumeControl.addEventListener("click", function () {
      var isMuted = this.classList.contains("mute");
      if (isMuted) {
        this.classList.remove("mute");
        video.muted = false;
        this.setAttribute("aria-pressed", "true");
        this.setAttribute("aria-label", muteLabel);
      } else {
        this.classList.add("mute");
        video.muted = true;
        this.setAttribute("aria-pressed", "false");
        this.setAttribute("aria-label", unmuteLabel);
      }
    });
  }

  function bindMobileKeyboardFooterOffset() {
    var baselineHeight = window.innerHeight;

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 600) return;

      var keyboardHeight = Math.max(0, baselineHeight - window.innerHeight);
      var ftcElement = document.querySelector(".ftc");
      if (ftcElement) ftcElement.style.bottom = keyboardHeight + 30 + "px";
    });
  }

  focusPasswordInput();
  applyBackgroundImageFromDataAttribute();
  bindVideoVolumeToggle();
  bindMobileKeyboardFooterOffset();
})();
