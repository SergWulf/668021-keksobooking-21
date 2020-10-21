'use strict';

// Модуль отрисовки меток

(function () {
  // Создаем шаблон для отображения метки на карте
  const pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // Функция отрисовки метки на карте
  const renderPin = function (realEstatePin) {
    const pinElement = pinTemplate.cloneNode(true);
    const pinPointerCoordinateX = Number(realEstatePin['location']['x']) - window.data.COORDINATE_PIN_X;
    const pinPointerCoordinateY = Number(realEstatePin['location']['y']) - window.data.COORDINATE_PIN_Y;
    pinElement.style = `left: ${pinPointerCoordinateX}px; top: ${pinPointerCoordinateY}px;`;
    pinElement.querySelector('img').src = realEstatePin['author']['avatar'];
    pinElement.querySelector('img').alt = realEstatePin['offer']['title'];
    return pinElement;
  };

  // Функция отрисовки всех меток во фрагмент
  const renderPins = function (realEstatesPin) {
    const fragment = document.createDocumentFragment();

    // По количество меток меньше значения константы, то отобразить только их, если больше, то ограничится значением константы
    window.data.currentCountShowPins = (realEstatesPin.length < window.data.COUNT_SHOW_PINS) ? realEstatesPin.length : window.data.COUNT_SHOW_PINS;

    for (let i = 0; i < window.data.currentCountShowPins; i++) {
      const newPinElement = renderPin(realEstatesPin[i]);
      newPinElement.setAttribute('data-index', i);
      fragment.appendChild(newPinElement);
    }
    return fragment;
  };

  // Экспорт функции
  window.pin = {
    renderPins: renderPins
  };

})();
