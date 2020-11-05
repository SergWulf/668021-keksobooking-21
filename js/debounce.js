'use strict';

const ESCAPE = `Escape`;
const ENTER = `Enter`;
const INPUT = `INPUT`;
const OPTION = `OPTION`;

const Method = {
  GET: `GET`,
  POST: `POST`
};

// Задережка в мс
const DEBOUNCE_INTERVAL = 500;

let lastTimeout = null;

// Передается функция коллбэк, которую нужно вызвать с задержкой.
window.debounce = (cb) => {
  if (lastTimeout) {
    window.clearTimeout(lastTimeout);
  }
  lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
};
