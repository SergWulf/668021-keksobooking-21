'use strict';

// Модуль отрисовки меток

// Количество отображаемых меток на карте PIN
const COUNT_SHOW_PINS = 5;

// Текущее кол-во
let currentCountShowPins = COUNT_SHOW_PINS;

// Координаты указателя метки мелких меток PIN
const COORDINATE_PIN_X = 25;
const COORDINATE_PIN_Y = 70;

// Создаем шаблон для отображения метки на карте
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

// Функция отрисовки метки на карте
const renderPin = (realEstatePin) => {
  const pinElement = pinTemplate.cloneNode(true);
  const pinPointerCoordinateX = Number(realEstatePin[`location`][`x`]) - COORDINATE_PIN_X;
  const pinPointerCoordinateY = Number(realEstatePin[`location`][`y`]) - COORDINATE_PIN_Y;
  pinElement.style = `left: ${pinPointerCoordinateX}px; top: ${pinPointerCoordinateY}px;`;
  const pinElementImg = pinElement.querySelector(`img`);
  pinElementImg.src = realEstatePin[`author`][`avatar`];
  pinElementImg.alt = realEstatePin[`offer`][`title`];
  return pinElement;
};

// Функция отрисовки всех меток во фрагмент
const render = (realEstatesPin) => {
  const fragment = document.createDocumentFragment();

  // По количество меток меньше значения константы, то отобразить только их, если больше, то ограничится значением константы
  currentCountShowPins = (realEstatesPin.length < COUNT_SHOW_PINS) ? realEstatesPin.length : COUNT_SHOW_PINS;

  for (let i = 0; i < currentCountShowPins; i++) {
    const newPinElement = renderPin(realEstatesPin[i]);
    newPinElement.setAttribute(`data-index`, i);
    fragment.appendChild(newPinElement);
  }

  return fragment;
};

// Экспорт функции
window.pin = {
  render
};
