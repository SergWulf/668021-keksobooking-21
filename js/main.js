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

/*

// Создание объектов JS на основе созданных данных
 let realEstates = createRealEstates(COUNT_REAL_ESTATE);

// Переключаем карту в активное состояние
const mapAdverts = document.querySelector('.map');
mapAdverts.classList.remove('map--faded');
*/

// Создаем шаблон для отображения метки на карте
const pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// Функция отрисовки метки на карте
const renderPin = function (realEstatePin) {
  const pinElement = pinTemplate.cloneNode(true);
  const pinPointerCoordinateX = Number(realEstatePin['location']['x']) - COORDINATE_PIN_X;
  const pinPointerCoordinateY = Number(realEstatePin['location']['y']) - COORDINATE_PIN_Y;
  pinElement.style = 'left: ' + pinPointerCoordinateX + 'px; top: ' + pinPointerCoordinateY + 'px;';
  pinElement.querySelector('img').src = realEstatePin['author']['avatar'];
  pinElement.querySelector('img').alt = realEstatePin['offer']['title'];
  return pinElement;
};

// Функция отрисовки всех меток во фрагмент
const renderPins = function (realEstatesPin) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < realEstatesPin.length; i++) {
    const newPinElement = renderPin(realEstatesPin[i]);
    newPinElement.setAttribute('data-index', i);
    fragment.appendChild(newPinElement);
  }
  return fragment;
};

/*
// Находим блок, где будем отображать метки и вставляем их в виде фрагмента
const blockPins = document.querySelector('.map__pins');
blockPins.appendChild(renderPins(realEstates));
*/

// Создаем шаблон для отображения карточки объекта недвижимости
const cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

// Функция отображения карточки, если данных для заполнения блока не хватает, то блок скрывается
const renderCard = function (realEstateCard) {
  const cardElement = cardTemplate.cloneNode(true);

  if (realEstateCard['offer']['title']) {
    cardElement.querySelector('.popup__title').textContent = realEstateCard['offer']['title'];
  } else {
    cardElement.querySelector('.popup__title').classList.add('visually-hidden');
  }
  if (realEstateCard['offer']['address']) {
    cardElement.querySelector('.popup__text--address').textContent = realEstateCard['offer']['address'];
  } else {
    cardElement.querySelector('.popup__text--address').classList.add('visually-hidden');
  }
  if (realEstateCard['offer']['price']) {
    cardElement.querySelector('.popup__text--price').innerHTML = realEstateCard['offer']['price'] + '&#x20bd;' + '<span>/ночь</span>';
  } else {
    cardElement.querySelector('.popup__text--price').classList.add('visually-hidden');
  }
  if (realEstateCard['offer']['type']) {
    cardElement.querySelector('.popup__type').textContent = TYPE_RESIDENCE[realEstateCard['offer']['type']];
  } else {
    cardElement.querySelector('.popup__type').classList.add('visually-hidden');
  }
  if (realEstateCard['offer']['rooms']) {
    cardElement.querySelector('.popup__text--capacity').textContent = realEstateCard['offer']['rooms'] + ' комнаты для ' + realEstateCard['offer']['guests'] + ' гостей';
  } else {
    cardElement.querySelector('.popup__text--capacity').classList.add('visually-hidden');
  }
  if ((realEstateCard['offer']['checkin']) && (realEstateCard['offer']['checkout'])) {
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + realEstateCard['offer']['checkin'] + ', выездо до ' + realEstateCard['offer']['checkout'];
  } else {
    cardElement.querySelector('.popup__text--time').classList.add('visually-hidden');
  }

  // В разметке находим блок предоставления услуг
  const popupFeatures = cardElement.querySelector('.popup__features');
  // Удаляем все виды услуг из разметки
  while (popupFeatures.firstChild) {
    popupFeatures.removeChild(popupFeatures.firstChild);
  }
  if (realEstateCard['offer']['features'].length !== 0) {
    // Добавляем нужные услуги в разметку
    for (let i = 0; i < realEstateCard['offer']['features'].length; i++) {
      const elementFeature = document.createElement('li');
      elementFeature.className = 'popup__feature popup__feature--' + realEstateCard['offer']['features'][i];
      popupFeatures.appendChild(elementFeature);
    }
  } else {
    popupFeatures.classList.add('visually-hidden');
  }

  if (realEstateCard['offer']['description']) {
    cardElement.querySelector('.popup__description').textContent = realEstateCard['offer']['description'];
  } else {
    cardElement.querySelector('.popup__description').classList.add('visually-hidden');
  }
  // Добавляем фотографии в карточку объекта недвижимости
  const popupPhotos = cardElement.querySelector('.popup__photos');

  if (realEstateCard['offer']['photos'].length > 0) {
    for (let i = 0; i < realEstateCard['offer']['photos'].length; i++) {
      const popupPhoto = popupPhotos.querySelector('img').cloneNode(true);
      popupPhoto.src = realEstateCard['offer']['photos'][i];
      popupPhotos.appendChild(popupPhoto);
    }
    // Удаляем шаблонную фотокарточку.
    popupPhotos.children[0].remove();
  } else {
    popupPhotos.classList.add('visually-hidden');
  }


  if (realEstateCard['author']['avatar']) {
    cardElement.querySelector('.popup__avatar').src = realEstateCard['author']['avatar'];
  } else {
    cardElement.querySelector('.popup__avatar').classList.add('visually-hidden');
  }

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


// Отображаем первую карточку
mapAdverts.insertBefore(renderCard(realEstates[0]), mapAdverts.children[1]);
*/

// Находим форму объявлений и блок фильтров в DOM
const formAd = document.querySelector('.ad-form');
const formFilters = document.querySelector('.map__filters');

// Блокируем изменение атрибутов формы
for (let i = 0; i < formAd.children.length; i++) {
  formAd.children[i].setAttribute('disabled', 'disabled');
}

// Блокируем изменение атрибутов блока фильтров
for (let i = 0; i < formFilters.children.length; i++) {
  formFilters.children[i].setAttribute('disabled', 'disabled');
}

// Находим карту объявлений и главную метку в DOM
const mapAdverts = document.querySelector('.map');
const mapPin = document.querySelector('.map__pin--main');

// Функция обработчик - срабатывает, когда пользователь отпускает кнопку мыши с главной метки.
const buttonMouseUpHandlerCreatePins = function () {
  // Создание объектов JS на основе созданных данных
  realEstates = createRealEstates(COUNT_REAL_ESTATE);
  // Находим блок, где будем отображать метки и отображаем их
  const blockPins = document.querySelector('.map__pins');
  blockPins.appendChild(renderPins(realEstates));
  // Удаляем обработчик
  mapPin.removeEventListener('mouseup', buttonMouseUpHandlerCreatePins);
};

/*
 Функция обработчик - срабатывает, когда пользователь (нажимает)отпускает кнопку мыши:
 происходит активация карты, блока фильтров и формы объявлений.
*/
const buttonMouseUpHandler = function () {
  mapAdverts.classList.remove('map--faded');
  formAd.classList.remove('ad-form--disabled');
  formFilters.classList.remove('ad-form--disabled');
  for (let i = 0; i < formAd.children.length; i++) {
    formAd.children[i].removeAttribute('disabled');
  }
  for (let i = 0; i < formFilters.children.length; i++) {
    formFilters.children[i].removeAttribute('disabled');
  }
  // Задание 2. Узнать координаты метки.
  // Узнать координаты первой метки
  // Вычислить координаты ее центра
  const leftMapPin = mapPin.offsetLeft + HALF_WIDTH_MAIN_PIN;
  const topMapPin = mapPin.offsetTop + HALF_HEIGHT_MAIN_PIN;
  // Записать данные координат в форму объявления
  formAd.querySelector('#address').setAttribute('value', leftMapPin + ', ' + topMapPin);
};

// Вешаем 2 обработчика событий на главную метку
mapPin.addEventListener('mouseup', buttonMouseUpHandlerCreatePins);
mapPin.addEventListener('mouseup', buttonMouseUpHandler);

// Обработчик события клика мыши на метке для отображения карточки объявления
mapAdverts.addEventListener('click', function (evt) {
  // Опеределяем, где именно произошло событие
  let target = evt.target;
  // Если на изображении метки, то присваем его предку (button)(самой метке)
  if (target.tagName === 'IMG') {
    target = target.parentNode;
  }
  // Если метка содержит класс 'map__pin' и не содержит класс 'map__pin--main', то есть не является главной
  if ((target.classList.contains('map__pin')) && (!target.classList.contains('map__pin--main'))) {
    // Если есть карточка с характеристиками обьявления, то удаляем ее из разметки
    if (mapAdverts.querySelector('.map__card')) {
      mapAdverts.removeChild(mapAdverts.querySelector('.map__card'));
    }
    // Отображаем карточку объявлений соответствующую метке.
    mapAdverts.insertBefore(renderCard(realEstates[target.dataset.index]), mapAdverts.children[1]);
  }
});
