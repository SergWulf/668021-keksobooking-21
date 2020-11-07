'use strict';

const ESCAPE = `Escape`;
const ENTER = `Enter`;
const INPUT = `INPUT`;
const OPTION = `OPTION`;
const SRC_DEFAULT_IMAGE = `img/muffin-grey.svg`;
// Задережка в мс
const DEBOUNCE_INTERVAL = 500;

const Method = {
  GET: `GET`,
  POST: `POST`
};

let lastTimeout = null;

// Передается функция коллбэк, которую нужно вызвать с задержкой.
const debounce = (cb) => {
  if (lastTimeout) {
    window.clearTimeout(lastTimeout);
  }
  lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
};

// Экспорт данных
window.util = {
  ESCAPE,
  ENTER,
  INPUT,
  OPTION,
  SRC_DEFAULT_IMAGE,
  Method,
  debounce
};
