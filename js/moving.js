'use strict';

// Модуль отвечающий за перемещение метки по карте

// В адрес записываются координаты острого конца метки. Его нужно вычислить.

(function () {

  // Функция отображения координат метки
  const showCoordinatesMapPin = function (pin, drag) {
    // Если метка не двигалась, то записывает координаты ее центра
    let leftMapPin = pin.offsetLeft + window.data.HALF_WIDTH_MAIN_PIN;
    let topMapPin = pin.offsetTop + window.data.HALF_HEIGHT_MAIN_PIN;
    // Если была сдвинута, то записывает координаты ее указателя
    if (drag) {
      topMapPin = pin.offsetTop + window.data.HEIGHT_PIN_MAIN;
    }
    // Записать данные координат в форму объявления
    return `${leftMapPin}, ${topMapPin}`;
  };

  //  Функция обработка события drag-and-drop
  const buttonMouseDownHandler = function (evt) {
    evt.preventDefault();
    // Начальные координаты во время нажатия на метку
    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    let dragged = false;
    // Обработка события move
    const buttonMouseMoveHandler = function (moveEvt) {
      dragged = true;
      moveEvt.preventDefault();
      // Сохраняем разницу координат между начальной и текущей позицией метки
      let shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      // Пересохраняем начальные координаты, на текущие
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      // Изменяем координаты метки
      // Если по горизонтали влево значение координаты Х равно или меньше нуля, то перестаем изменять координату X
      // Если по горизонтали вправо значение координаты Х равно или больше размера блока карты с учётом вычета ширины метки, то перестаем изменять координату X
      // Если по вертикали сверху значение координаты Y равно или меньше 130, то перестаем изменять координату Y
      // Если по вертикали снизу значение коорданаты Y больше 630 (с учетом вычета высоты метки), то перестаем изменять координату Y.
      const newOffsetLeft = Number(window.map.mapPin.offsetLeft - shift.x);
      const newOffsetTop = Number(window.map.mapPin.offsetTop - shift.y);
      const minCoordinateX = 0;
      const maxCoordinateX = document.querySelector('.map').clientWidth - window.data.WIDTH_PIN_MAIN;
      const minCoordinateY = window.data.MIN_MAP_Y - window.data.HEIGHT_PIN_MAIN;
      const maxCoordinateY = window.data.MAX_MAP_Y - window.data.HEIGHT_PIN_MAIN;
      if ((newOffsetLeft >= minCoordinateX) && (newOffsetLeft <= maxCoordinateX)) {
        window.map.mapPin.style.left = `${window.map.mapPin.offsetLeft - shift.x}px`;
      }
      if (((newOffsetTop >= minCoordinateY)) && (newOffsetTop <= maxCoordinateY)) {
        window.map.mapPin.style.top = `${window.map.mapPin.offsetTop - shift.y}px`;
      }
      // Запись координат в форму объявления
      window.form.adForm.querySelector('#address').setAttribute('value', showCoordinatesMapPin(window.map.mapPin, dragged));
    };
    // Обработка события mouseup
    const buttonMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      // Запись координат в форму объявления
      window.form.adForm.querySelector('#address').setAttribute('value', showCoordinatesMapPin(window.map.mapPin, dragged));
      document.removeEventListener('mousemove', buttonMouseMoveHandler);
      document.removeEventListener('mouseup', buttonMouseUpHandler);
    };
    document.addEventListener('mousemove', buttonMouseMoveHandler);
    document.addEventListener('mouseup', buttonMouseUpHandler);
  };

  window.map.mapPin.addEventListener('mousedown', buttonMouseDownHandler);
})();
