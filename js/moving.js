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
    return String(leftMapPin + ', ' + topMapPin);
  };
  /*g
  // Дополнительная очистка поля с данными координат метки
  const buttonFormReset = document.querySelector('.ad-form__reset');
  const buttonResetClickHandler = function (evtReset) {
    evtReset.preventDefault();
    formAd.reset();
    mapAdverts.classList.add('map--faded');
    formFilters.classList.add('ad-form--disabled');
    const blockPins = document.querySelector('.map__pins');
    for (let i = 0; i < realEstates.length; i++) {
      blockPins.removeChild(blockPins.lastChild);
    }

    mapPin.style.left = String(BEGIN_PIN_MAIN_COORIDNATE_X + 'px');
    mapPin.style.top = String(BEGIN_PIN_MAIN_COORDINATE_Y + 'px');
    // Изначальные координаты метки
    formAd.querySelector('#address').setAttribute('value', showCoordinatesMapPin(mapPin, false));
    blockingFormFields(true);
    // Обработка события 'mouseup' через 'mousedown' на главной метке: создание меток на карте и разблокировки полей формы
    mapPin.addEventListener('mousedown', buttonMouseDownHandlerCreatePins);
  };

  buttonFormReset.addEventListener('click', buttonResetClickHandler);

  //  Функция обработка события drag-and-drop
  var buttonMouseDownHandler = function (evt) {
    evt.preventDefault();
    // Начальные координаты во время нажатия на метку
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var dragged = false;
    // Обработка события move
    var buttonMouseMoveHandler = function (moveEvt) {
      dragged = true;
      moveEvt.preventDefault();
      // Сохраняем разницу координат между начальной и текущей позицией метки
      var shift = {
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
      var newOffsetLeft = Number(mapPin.offsetLeft - shift.x);
      var newOffsetTop = Number(mapPin.offsetTop - shift.y);
      var minCoordinateX = 0;
      var maxCoordinateX = document.querySelector('.map').clientWidth - WIDTH_PIN_MAIN;
      var minCoordinateY = MIN_MAP_Y - HEIGHT_PIN_MAIN;
      var maxCoordinateY = MAX_MAP_Y - HEIGHT_PIN_MAIN;
      if ((newOffsetLeft >= minCoordinateX) && (newOffsetLeft <= maxCoordinateX)) {
        mapPin.style.left = (mapPin.offsetLeft - shift.x) + 'px';
      }
      if (((newOffsetTop >= minCoordinateY)) && (newOffsetTop <= maxCoordinateY)) {
        mapPin.style.top = (mapPin.offsetTop - shift.y) + 'px';
      }
      // Запись координат в форму объявления
      formAd.querySelector('#address').setAttribute('value', showCoordinatesMapPin(mapPin, dragged));
    };
    // Обработка события mouseup
    var buttonMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      // Запись координат в форму объявления
      formAd.querySelector('#address').setAttribute('value', showCoordinatesMapPin(mapPin, dragged));
      document.removeEventListener('mousemove', buttonMouseMoveHandler);
      document.removeEventListener('mouseup', buttonMouseUpHandler);
    };
    document.addEventListener('mousemove', buttonMouseMoveHandler);
    document.addEventListener('mouseup', buttonMouseUpHandler);
  }; */
})();
