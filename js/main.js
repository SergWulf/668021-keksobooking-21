'use strict';

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
  return arr;
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

// Создание объектов JS на основе созданных данных
const realEstates = createRealEstates(COUNT_REAL_ESTATE);

// Переключаем карту в активное состояние
const mapAdverts = document.querySelector('.map');
mapAdverts.classList.remove('map--faded');

// Создаем шаблон для отображения метки на карте
const pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// Функция отрисовки метки на карте
const renderPin = function (realEstatePin) {
  const pinElement = pinTemplate.cloneNode(true);
  const pinPointerCoordinateX = Number(realEstatePin['location']['x']) - COORDINATE_PIN_X;
  const pinPointerCoordianteY = Number(realEstatePin['location']['y']) - COORDINATE_PIN_Y;
  pinElement.style = 'left: ' + pinPointerCoordinateX + 'px; top: ' + pinPointerCoordianteY + 'px;';
  pinElement.querySelector('img').src = realEstatePin['author']['avatar'];
  pinElement.querySelector('img').alt = realEstatePin['offer']['title'];
  return pinElement;
};

// Функция отрисовки всех меток во фрагмент
const renderPins = function (realEstatesPin) {
  const fragment = document.createDocumentFragment();
  for (let j = 0; j < realEstatesPin.length; j++) {
    fragment.appendChild(renderPin(realEstatesPin[j]));
  }
  return fragment;
};

// Находим блок, где будем отображать метки и вставляем их в виде фрагмента
const blockPins = document.querySelector('.map__pins');
blockPins.appendChild(renderPins(realEstates));

// Создаем шаблон для отображения карточки объекта недвижимости
const cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

// Функция отображения карточки
const renderCard = function (realEstateCard) {
  const cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = realEstateCard['offer']['title'];
  cardElement.querySelector('.popup__text--address').textContent = realEstateCard['offer']['address'];
  cardElement.querySelector('.popup__text--price').innerHTML = realEstateCard['offer']['price'] + '&#x20bd;' + '<span>/ночь</span>';
  cardElement.querySelector('.popup__type').textContent = TYPE_RESIDENCE[realEstateCard['offer']['type']];
  cardElement.querySelector('.popup__text--capacity').textContent = realEstateCard['offer']['rooms'] + ' комнаты для ' + realEstateCard['offer']['guests'] + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + realEstateCard['offer']['checkin'] + ', выездо до ' + realEstateCard['offer']['checkout'];
  // В разметке находим блок предоставления услуг
  const popupFeatures = cardElement.querySelector('.popup__features');
  // Удаляем все виды услуг из разметки
  while (popupFeatures.firstChild) {
    popupFeatures.removeChild(popupFeatures.firstChild);
  }
  // Добавляем нужные услуги в разметку
  for (let i = 0; i < realEstateCard['offer']['features'].length; i++) {
    const elementFeature = document.createElement('li');
    elementFeature.className = 'popup__feature popup__feature--' + realEstateCard['offer']['features'][i];
    popupFeatures.appendChild(elementFeature);
  }
  cardElement.querySelector('.popup__description').textContent = realEstateCard['offer']['description'];
  // Добавляем фотографии в карточку объекта недвижимости
  const popupPhotos = cardElement.querySelector('.popup__photos');
  for (let i = 0; i < realEstateCard['offer']['photos'].length; i++) {
    const popupPhoto = popupPhotos.querySelector('img').cloneNode(true);
    popupPhoto.src = realEstateCard['offer']['photos'][i];
    popupPhotos.appendChild(popupPhoto);
  }
  popupPhotos.removeChild(popupPhotos.children[0]);
  cardElement.querySelector('.popup__avatar').src = realEstateCard['author']['avatar'];
  return cardElement;
};

/*
var renderCards = function (realEstatesCard) {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < realEstatesCard.length; j++) {
    fragment.appendChild(renderCard(realEstatesCard[j]));
  }
  return fragment;
};
*/

// Отображаем первую карточку
mapAdverts.insertBefore(renderCard(realEstates[0]), mapAdverts.children[1]);
