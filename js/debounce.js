'use strict';

// Задережка в мс
const DEBOUNCE_INTERVAL = 500;

let lastTimeout = null;

// Передается функция коллбэк, которую нужно вызвать с задержкой.
window.debounce = function (cb) {
  if (lastTimeout) {
    window.clearTimeout(lastTimeout);
  }
  lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
};
