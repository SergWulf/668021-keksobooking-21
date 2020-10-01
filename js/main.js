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
const MAX_ROOMS = 100;
const MAX_GUESTS = 0;
const MESSAGE_ERROR_VALIDATION = 'Количество гостей не соответствует количеству комнат: 1 комната - 1 гость, 2 комнаты - 1 или 2 гостя, 3 комнаты - 1, 2 или 3 гостя, 100 комнат - не для гостей';


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
  // Возвращаем именн копию массива, а не ссылку,
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

  // Находим кнопку-крестик в окне отображения карточки
  const closePopup = cardElement.querySelector('.popup__close');
  // Вешаем обработчик, в котором по клику скрываем блок карточки
  closePopup.addEventListener('click', function () {
    cardElement.classList.add('hidden');
  });

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

// Узнаем координаты главной метки еще до активации страницы и записываем его в поле формы адреса
const LEFT_MAP_PIN = mapPin.offsetLeft + HALF_WIDTH_MAIN_PIN;
const TOP_MAP_PIN = mapPin.offsetTop + HALF_HEIGHT_MAIN_PIN;
// Записать данные координат в форму объявления
formAd.querySelector('#address').setAttribute('value', LEFT_MAP_PIN + ', ' + TOP_MAP_PIN);

// Функция активации: рисуются метки, активируется карта
// блок фильтров, форма.
const activationPage = function () {
  mapAdverts.classList.remove('map--faded');
  formAd.classList.remove('ad-form--disabled');
  formFilters.classList.remove('ad-form--disabled');
  for (let i = 0; i < formAd.children.length; i++) {
    formAd.children[i].removeAttribute('disabled');
  }
  for (let i = 0; i < formFilters.children.length; i++) {
    formFilters.children[i].removeAttribute('disabled');
  }

  // Записать данные координат в форму объявления
  formAd.querySelector('#address').setAttribute('value', LEFT_MAP_PIN + ', ' + TOP_MAP_PIN);

  // Создание объектов JS на основе созданных данных
  realEstates = createRealEstates(COUNT_REAL_ESTATE);
  // Находим блок, где будем отображать метки и отображаем их
  const blockPins = document.querySelector('.map__pins');
  blockPins.appendChild(renderPins(realEstates));
};

// Обработчики событий: активируют страницу кексобукинга
// по нажатию левой кнопки мыши или клавиши Enter(когда метка в фокусе)
const buttonMouseDownHandler = function (evt) {
  if (evt.button === 0) {
    activationPage();
    // Удаляем обработчики
    mapPin.removeEventListener('mousedown', buttonMouseDownHandler);
    mapPin.removeEventListener('keydown', buttonKeyDownHandler);
  }
};

const buttonKeyDownHandler = function (evt) {
  if (evt.key === 'Enter') {
    activationPage();
    // Удаляем обработчики
    mapPin.removeEventListener('mousedown', buttonMouseDownHandler);
    mapPin.removeEventListener('keydown', buttonKeyDownHandler);
  }
};

// Вешаем 2 обработчика событий на главную метку
mapPin.addEventListener('keydown', buttonKeyDownHandler);
mapPin.addEventListener('mousedown', buttonMouseDownHandler);

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
    // Если уже есть карточка с характеристиками обьявления, то удаляем ее из разметки
    if (mapAdverts.querySelector('.map__card')) {
      mapAdverts.removeChild(mapAdverts.querySelector('.map__card'));
    }
    // Отображаем карточку объявлений соответствующую метке.
    mapAdverts.insertBefore(renderCard(realEstates[target.dataset.index]), mapAdverts.children[1]);
  }
});

// Элементы формы DOM
const adForm = document.querySelector('.ad-form');
const titleForm = document.querySelector('#title');
const priceForm = document.querySelector('#price');
const addressForm = document.querySelector('#address');
const typeOfHouseForm = document.querySelector('#type');
const timeInForm = document.querySelector('#timein');
const timeOutForm = document.querySelector('#timeout');


// Функция ограничений для полей ввода формы объявлений, до валидации формы

const createAttributesForm = function () {

  // 0. Найти форму в DOM, установить ей атрибут action = "https://javascript.pages.academy/keksobooking"

  adForm.setAttribute('active', 'https://javascript.pages.academy/keksobooking');
  // 1. Найти заголовок объявления в разметке, установить для него атрибуты: обязательное текстовое, минимальное длина 30 сим, максимальная 100 символов.

  titleForm.setAttribute('required', 'required');
  titleForm.setAttribute('minlength', '30');
  titleForm.setAttribute('maxlength', '100');
  // 2. Цена за ночь. Обязательное числовое поле. Максимальное значение 1 000 000.

  priceForm.setAttribute('required', 'required');
  priceForm.setAttribute('max', '1000000');

  // 3. Адрес, обязательное поле, недоступно для редактирования
  addressForm.setAttribute('readonly', 'readonly');
};

createAttributesForm();

// 3. Тип жилья. В зависимости от типа, меняется минимальная цена и отображается в виде плейсхолдера.
// Валидация соответствия: вид жительста - минимальная цена
//     «Бунгало» — минимальная цена за ночь 0;
//     «Квартира» — минимальная цена за ночь 1 000;
//     «Дом» — минимальная цена 5 000;
//     «Дворец» — минимальная цена 10 000;
// Вместе с минимальным значением цены нужно изменять и плейсхолдер.

// Обработка первоначального значения формы
priceForm.setAttribute('min', TYPE_RESIDENCE_PRICE[typeOfHouseForm.options[typeOfHouseForm.selectedIndex].value]);
priceForm.setAttribute('placeholder', TYPE_RESIDENCE_PRICE[typeOfHouseForm.options[typeOfHouseForm.selectedIndex].value]);


// Вешаем обработчик на изменение типа жилья
typeOfHouseForm.addEventListener('change', function (evt) {
  priceForm.setAttribute('min', TYPE_RESIDENCE_PRICE[typeOfHouseForm.options[evt.currentTarget.selectedIndex].value]);
  priceForm.setAttribute('placeholder', TYPE_RESIDENCE_PRICE[typeOfHouseForm.options[evt.currentTarget.selectedIndex].value]);
});

// Валидация полей заезды и выезда
// Поля «Время заезда» и «Время выезда» синхронизированы:
// при изменении значения одного поля, во втором выделяется соответствующее ему.
// Например, если время заезда указано «после 14», то время выезда будет равно «до 14» и наоборот.
//
// 1. Обработка события на каждом поле
// 2. Если одно поле принимает определенное значение, то и другое поле, послы выбора значения, принимает тоже значение

const validationTime = function (evt) {
  if (evt.currentTarget.name === 'timeout') {
    timeInForm.options.selectedIndex = timeOutForm.options.selectedIndex;
  } else {
    timeOutForm.options.selectedIndex = timeInForm.options.selectedIndex;
  }
};

timeInForm.addEventListener('change', validationTime);
timeOutForm.addEventListener('change', validationTime);

// Функция - обработчик события формы (отменяет действие по умолчанию, вызывает функцию валидации,
// если поля не соотвествуют ограничениям, то подсвечивать их красным цветом, если все поля правильно
// заполнены, то происходит отправка данных на сервер
// Затем главная страница возвращается в исходное состояние(неактивное, когда карта заблокирована, блоки фильтров и форма подачи объявления).

// Функция валидации формы (вызывается событием отправки формы).
// const validationForm = function() {
// 4. Адрес. Ручное редактирование запрещено. Выставляется автоматически, при перемещении метки.
// 5. Поля время заезда и выезда. Они синхронизированны. Если указано время заезда после 14, то время выезда до 14, и наоборот.
// 6. Поле "количество комнат". Синхронизировано с полем "количество мест"
// 7. Значения полей "ваша фотография" и "фотография жилья" может быть только изобажение.
//
// }

const roomNumberForm = document.querySelector('#room_number');
const capacityForm = document.querySelector('#capacity');

const validationGuestsInRoom = function (evt) {
  // Сразу записываем сообщения об несоответствии комнат и гостей, в дальнейшем эти значения примут истинные значения
  roomNumberForm.setCustomValidity(MESSAGE_ERROR_VALIDATION);
  capacityForm.setCustomValidity(MESSAGE_ERROR_VALIDATION);

  // Узнаем, есть ли максимальные значения в данный момент в полях: комнаты - гости
  const expressionMaxRooms = (Number(roomNumberForm.options[roomNumberForm.selectedIndex].value) === MAX_ROOMS);
  const expressionMaxGuests = (Number(capacityForm.options[capacityForm.selectedIndex].value) === MAX_GUESTS);
  // Записываем значения условия (здесь условие, проверяющие, что нету не стандартных значений в комнатах и кол-ве гостей
  const expressionWithoutMaxValue = ((!expressionMaxRooms) && (!expressionMaxGuests));
  // Здесь условие, что выбраны именно не стандартные значения комнат и гостей: 100 и 0;
  const expressionWithMaxValue = (expressionMaxGuests && expressionMaxRooms);
  // Переменная, которая хранит условие проверки соответсвия гостей - комнатам, либо комнат - гостям.
  let currentExpressionCondition = (roomNumberForm.options[roomNumberForm.selectedIndex].value >= capacityForm.options[capacityForm.selectedIndex].value);
  // Если меняется значение гостей, то меняетс условие соответствия гостей комнат
  if ((Boolean(evt)) && (evt.currentTarget.name === 'capacity')) {
    currentExpressionCondition = (capacityForm.options[capacityForm.selectedIndex].value <= roomNumberForm.options[roomNumberForm.selectedIndex].value);
  }
  // Основная проверка соответствия комнат гостям,
  // Если комнаты соответствуют гостям и поля не содержать максимальных значений,
  // или есть максимальные значения, но они в обоих полях, то всё валидно, иначе выводим сообщение!
  if ((expressionWithoutMaxValue && currentExpressionCondition) || (expressionWithMaxValue)) {
    roomNumberForm.setCustomValidity('');
    capacityForm.setCustomValidity('');
  }
};

validationGuestsInRoom(false);
roomNumberForm.addEventListener('change', validationGuestsInRoom);
capacityForm.addEventListener('change', validationGuestsInRoom);
