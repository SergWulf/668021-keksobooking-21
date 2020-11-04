'use strict';

// Модуль отвечающий за перемещение метки по карте

// Минимальные и максимальные значения карты по вертикали для меток
const MIN_MAP_Y = 130;
const MAX_MAP_Y = 630;

// Высота главной метки
const HEIGHT_PIN_MAIN = 82;

// Функция отображения координат метки
const showCoordinatesMapPin = (pin, drag) => {
  // Если метка не двигалась, то записывает координаты ее центра
  let leftMapPin = pin.offsetLeft + window.map.HALF_WIDTH_MAIN_PIN;
  let topMapPin = pin.offsetTop + window.map.HALF_HEIGHT_MAIN_PIN;
  // Если была сдвинута, то записывает координаты ее указателя
  if (drag) {
    topMapPin = pin.offsetTop + HEIGHT_PIN_MAIN;
  }
  // Записать данные координат в форму объявления
  return `${leftMapPin}, ${topMapPin}`;
};

//  Функция обработка события drag-and-drop
const buttonMouseDownHandler = (evt) => {
  evt.preventDefault();
  // Начальные координаты во время нажатия на метку
  let startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };
  let dragged = false;
  // Обработка события move
  const buttonMouseMoveHandler = (moveEvt) => {
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
    const newOffsetLeft = Number(window.map.pin.offsetLeft - shift.x);
    const newOffsetTop = Number(window.map.pin.offsetTop - shift.y);
    const minCoordinateX = 0 - window.map.HALF_WIDTH_MAIN_PIN;
    const maxCoordinateX = document.querySelector(`.map`).clientWidth - window.map.HALF_WIDTH_MAIN_PIN;
    const minCoordinateY = MIN_MAP_Y - HEIGHT_PIN_MAIN;
    const maxCoordinateY = MAX_MAP_Y - HEIGHT_PIN_MAIN;
    if ((newOffsetLeft >= minCoordinateX) && (newOffsetLeft <= maxCoordinateX)) {
      window.map.pin.style.left = `${window.map.pin.offsetLeft - shift.x}px`;
    }
    if (((newOffsetTop >= minCoordinateY)) && (newOffsetTop <= maxCoordinateY)) {
      window.map.pin.style.top = `${window.map.pin.offsetTop - shift.y}px`;
    }
    // Запись координат в форму объявления
    window.form.advert.querySelector(`#address`).setAttribute(`value`, showCoordinatesMapPin(window.map.pin, dragged));
  };
  // Обработка события mouseup
  const buttonMouseUpHandler = (upEvt) => {
    upEvt.preventDefault();

    // Запись координат в форму объявления
    window.form.advert.querySelector(`#address`).setAttribute(`value`, showCoordinatesMapPin(window.map.pin, dragged));
    document.removeEventListener(`mousemove`, buttonMouseMoveHandler);
    document.removeEventListener(`mouseup`, buttonMouseUpHandler);
  };
  document.addEventListener(`mousemove`, buttonMouseMoveHandler);
  document.addEventListener(`mouseup`, buttonMouseUpHandler);
};

window.map.pin.addEventListener(`mousedown`, buttonMouseDownHandler);
