'use strict';

// Модуль с данными

(function () {

  // Размеры метки, с помощью которые можно вычислить центр метки
  const HALF_WIDTH_MAIN_PIN = 31;
  const HALF_HEIGHT_MAIN_PIN = 31;

  // Начальные координаты центра главной метки.
  const LEFT_MAP_PIN = document.querySelector('.map__pin--main').offsetLeft + HALF_WIDTH_MAIN_PIN;
  const TOP_MAP_PIN = document.querySelector('.map__pin--main').offsetTop + HALF_HEIGHT_MAIN_PIN;

  // Координаты указателя метки мелких меток
  const COORDINATE_PIN_X = 25;
  const COORDINATE_PIN_Y = 70;

  const MIN_MAP_Y = 130;
  const MAX_MAP_Y = 630;

  // Высота и ширина главной метки
  const HEIGHT_PIN_MAIN = 82;
  const WIDTH_PIN_MAIN = 62;

  const TYPE_RESIDENCE = {
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalow': 'Бунгало',
    'flat': 'Квартира'
  };

  const TYPE_RESIDENCE_PRICE = {
    'palace': 10000,
    'house': 5000,
    'bungalow': 0,
    'flat': 1000
  };

  const COUNT_SHOW_PINS = 5;

  // Массив для хранения данных об объектах недвижимости
  let realEstates = [];
  // Массив отфильтрованных данных
  let filterRealEstates = [];
  let errorsJSON = '';
  // Количество отображаемых меток на карте


  const URL_DOWNLOAD = 'https://21.javascript.pages.academy/keksobooking/data';
  const URL_UPLOAD = 'https://21.javascript.pages.academy/keksobooking';

  // Экспорт переменных и методов модуля data
  window.data = {
    COORDINATE_PIN_X: COORDINATE_PIN_X,
    COORDINATE_PIN_Y: COORDINATE_PIN_Y,
    LEFT_MAP_PIN: LEFT_MAP_PIN,
    TOP_MAP_PIN: TOP_MAP_PIN,
    HEIGHT_PIN_MAIN: HEIGHT_PIN_MAIN,
    WIDTH_PIN_MAIN: WIDTH_PIN_MAIN,
    MIN_MAP_Y: MIN_MAP_Y,
    MAX_MAP_Y: MAX_MAP_Y,
    HALF_WIDTH_MAIN_PIN: HALF_WIDTH_MAIN_PIN,
    HALF_HEIGHT_MAIN_PIN: HALF_HEIGHT_MAIN_PIN,
    TYPE_RESIDENCE: TYPE_RESIDENCE,
    TYPE_RESIDENCE_PRICE: TYPE_RESIDENCE_PRICE,
    realEstates: realEstates,
    filterRealEstates: filterRealEstates,
    COUNT_SHOW_PINS: COUNT_SHOW_PINS,
    errorsJSON: errorsJSON,
    URL_UPLOAD: URL_UPLOAD,
    URL_DOWNLOAD: URL_DOWNLOAD
  };

})();
