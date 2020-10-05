'use strict';

// Модуль с данными

(function () {

  const COUNT_REAL_ESTATE = 8;
  const MIN_PRICE = 1000;
  const MAX_PRICE = 1000000;
  const MIN_COUNT_ROOMS = 1;
  const MAX_COUNT_ROOMS = 5;
  const MIN_COUNT_GUESTS = 2;
  const MAX_COUNT_GUESTS = 11;
  const COORDINATE_PIN_X = 31;
  const COORDINATE_PIN_Y = 84;
  const MIN_COORDINATE_Y = 130 + COORDINATE_PIN_Y;
  const MAX_COORDINATE_Y = 630 - COORDINATE_PIN_Y;
  const MIN_COORDINATE_X = 0 + COORDINATE_PIN_X;
  const MAX_COORDINATE_X = document.querySelector('.map').clientWidth - COORDINATE_PIN_X;
  const HALF_WIDTH_MAIN_PIN = 31;
  const HALF_HEIGHT_MAIN_PIN = 31;


  const TITLES_RESIDENCE = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  const LIST_FEATURES = [
    'wifi',
    'dishwasher',
    'washer',
    'parking',
    'elevator',
    'conditioner'
  ];

  const LIST_CHECK_IN_OUT = ['12:00', '13:00', '14:00'];

  const LIST_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

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

  let realEstates = [];

  // Функция перемешивания массива, благополучно взятая из харбра, по совету, чтобы не изобретать велосипед :)
  const shuffle = function (arr) {
    let j;
    let temp;
    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    // Возвращаем именно копию массива, а не ссылку,
    // в противном случае все объекты будут
    // ссылаться на один и тот же массив
    return arr.slice();
  };

  // Функция получения случайного числа из положительного диапазона целых чисел
  const getRandomNumberRange = function (firstNumber, lastNumber) {
    return Math.round(Math.random() * (lastNumber - firstNumber) + firstNumber);
  };

  // Функция получения случайного элемента из массива
  const getRandomElementOfArray = function (listElements) {
    return Math.floor(Math.random() * listElements.length);
  };

  // Функция, которая ищет в названии тип недвижимости и возвращает его в удобочитаемом виде
  const getTypeResidence = function (titleTypeResidence) {
    for (let key in TYPE_RESIDENCE) {
      if ((titleTypeResidence.toLowerCase().indexOf(TYPE_RESIDENCE[key].toLowerCase())) !== -1) {
        return key;
      }
    }
    return 'unknown';
  };

  const getPathImageAvatar = function (numberImage) {
    if ((numberImage < 10) && (numberImage > 0)) {
      numberImage = '0' + numberImage;
    }
    return 'img/avatars/user' + numberImage + '.png';
  };

  const createRealEstates = function (count) {
    const listRealEstate = [];
    for (let i = 0; i < count; i++) {
      const realEstate = {
        'author': {
          'avatar': getPathImageAvatar(i + 1)
        },
        'offer': {
          'title': TITLES_RESIDENCE[i],
          'price': getRandomNumberRange(MIN_PRICE, MAX_PRICE),
          'type': getTypeResidence(TITLES_RESIDENCE[i]),
          'rooms': getRandomNumberRange(MIN_COUNT_ROOMS, MAX_COUNT_ROOMS),
          'guests': getRandomNumberRange(MIN_COUNT_GUESTS, MAX_COUNT_GUESTS),
          'checkin': LIST_CHECK_IN_OUT[getRandomElementOfArray(LIST_CHECK_IN_OUT)],
          'checkout': LIST_CHECK_IN_OUT[getRandomElementOfArray(LIST_CHECK_IN_OUT)],
          'features': shuffle(LIST_FEATURES).slice(Math.round(Math.random() * (LIST_FEATURES.length - 1))),
          'description': '',
          'photos': shuffle(LIST_PHOTOS)
        },
        'location': {
          'x': getRandomNumberRange(MIN_COORDINATE_X, MAX_COORDINATE_X),
          'y': getRandomNumberRange(MIN_COORDINATE_Y, MAX_COORDINATE_Y)
        },
      };
      realEstate['offer']['address'] = realEstate['location']['x'] + ', ' + realEstate['location']['y'];
      listRealEstate.push(realEstate);
    }
    return listRealEstate;
  };

  // Экспорт переменных и методов модуля data
  window.data = {
    COUNT_REAL_ESTATE: COUNT_REAL_ESTATE,
    COORDINATE_PIN_X: COORDINATE_PIN_X,
    COORDINATE_PIN_Y: COORDINATE_PIN_Y,
    HALF_WIDTH_MAIN_PIN: HALF_WIDTH_MAIN_PIN,
    HALF_HEIGHT_MAIN_PIN: HALF_HEIGHT_MAIN_PIN,
    TYPE_RESIDENCE: TYPE_RESIDENCE,
    TYPE_RESIDENCE_PRICE: TYPE_RESIDENCE_PRICE,
    realEstates: realEstates,
    createRealEstates: createRealEstates
  };

})();
