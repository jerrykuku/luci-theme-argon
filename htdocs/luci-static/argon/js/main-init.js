'use strict';

(function () {
  var winHeight = window.innerHeight;

  window.addEventListener('resize', function () {
    var winWidth = window.innerWidth;
    if (winWidth >= 600) return;

    var newHeight = window.innerHeight;
    var keyboardHeight = Math.max(0, winHeight - newHeight);
    var ftcElement = document.querySelector('.ftc');

    if (ftcElement) {
      ftcElement.style.bottom = keyboardHeight + 30 + 'px';
    }
  });
})();
