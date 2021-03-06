'use strict';

// Модуль карты: создание меток, отображение карточек, обработка событий

// Размеры метки, с помощью которые можно вычислить центр метки MAP
const HALF_WIDTH_MAIN_PIN = 31;
const HALF_HEIGHT_MAIN_PIN = 31;

// Начальные координаты  главной метки.
const LEFT_MAIN_PIN = 570;
const TOP_MAIN_PIN = 375;

// Координаты центра главной метки
const LEFT_MAIN_PIN_MAP = LEFT_MAIN_PIN + HALF_WIDTH_MAIN_PIN;
const TOP_MAIN_PIN_MAP = TOP_MAIN_PIN + HALF_HEIGHT_MAIN_PIN;

const URL_DOWNLOAD = `https://21.javascript.pages.academy/keksobooking/data`;

// Находим карту объявлений и главную метку в DOM
const adverts = document.querySelector(`.map`);
const pin = document.querySelector(`.map__pin--main`);
const formFilter = document.querySelector(`.map__filters`);

// Массив для хранения данных об объектах недвижимости
let realEstates = [];
// Массив отфильтрованных данных
let filteredRealEstates = [];

const getRealEstate = () => {
  return realEstates;
};

const setFilteredRealEstates = (newRealEstates) => {
  filteredRealEstates = newRealEstates;
};

// Функция отображения меток
const renderPinsJSON = () => {
  // Находим блок, где будем отображать метки и отображаем их
  const blockPins = document.querySelector(`.map__pins`);
  blockPins.appendChild(window.pin.render(filteredRealEstates));
};

// Функция удаления меток
const removePins = () => {
  // Находим и удаляем метки
  const pins = document.querySelectorAll(`.map__pin:not(.map__pin--main)`);
  pins.forEach((nodeChild) => {
    nodeChild.parentElement.removeChild(nodeChild);
  });
};

// Активация полей формы с фильтрами
const activateFormFilter = () => {
  formFilter.classList.remove(`ad-form--disabled`);
  Array.prototype.forEach.call(formFilter.children, (childFilter) => {
    childFilter.removeAttribute(`disabled`);
  });
};

const deactivateFormFilter = () => {
  formFilter.reset();
  formFilter.classList.add(`ad-form--disabled`);
  Array.prototype.forEach.call(formFilter.children, (childFilter) => {
    childFilter.setAttribute(`disabled`, `disabled`);
  });
};

const getDataHandler = (dataJSON) => {
  // Если в каком-то объекте отсутствует поле offer, то удаляем его,
  // также удаляем объекты без полей author и location
  let dataWithOffer = dataJSON.filter((realEstate) => {
    return realEstate[`offer`] && realEstate[`author`] && realEstate[`location`];
  });
  realEstates = dataWithOffer;
  filteredRealEstates = dataWithOffer;
  // Так как данные успешно получены, активируем форму фильтрации
  activateFormFilter();
  // Вызываем функцию отрисовки меток по JSON данным
  renderPinsJSON();
};

// Коллбэк функция успешной отправки данных формы.
const getErrorHandler = (message) => {
  const tagMain = document.querySelector(`main`);
  const errorPopup = document.createElement(`DIV`);
  errorPopup.classList.add(`error`);
  const errorText = document.createElement(`P`);
  errorText.classList.add(`error__message`);
  errorText.textContent = message;
  errorPopup.appendChild(errorText);
  errorPopup.setAttribute(`tabindex`, `0`);
  errorPopup.focus();
  tagMain.appendChild(errorPopup);

  // Обработчики закрытия окна
  errorPopup.addEventListener(`click`, () => {
    // Удалить окно из разметки
    tagMain.removeChild(tagMain.lastChild);
  });

  errorPopup.addEventListener(`keydown`, (evt) => {
    if (evt.key === window.util.ESCAPE) {
      // Удалить окно из разметки
      tagMain.removeChild(tagMain.lastChild);
    }
  });
};

// Функция активации: рисуются метки, активируется карта
// форма.
const activatePage = () => {
  adverts.classList.remove(`map--faded`);
  window.form.advert.classList.remove(`ad-form--disabled`);
  Array.prototype.forEach.call(window.form.advert.children, (childAdvertForm) => {
    childAdvertForm.removeAttribute(`disabled`);
  });
  // Загружаем JSON данные после активации
  window.load.requestData(getDataHandler, getErrorHandler, window.util.Method.GET, URL_DOWNLOAD);
};

// Обработчики событий: активируют страницу кексобукинга
// по нажатию левой кнопки мыши или клавиши Enter(когда метка в фокусе)
const buttonMouseDownHandler = (evt) => {
  if (evt.button === 0) {
    activatePage();
    // Удаляем обработчики
    pin.removeEventListener(`mousedown`, buttonMouseDownHandler);
    pin.removeEventListener(`keydown`, buttonKeyDownHandler);
  }
};

const buttonKeyDownHandler = (evt) => {
  if (evt.key === window.util.ENTER) {
    activatePage();
    // Удаляем обработчики
    pin.removeEventListener(`mousedown`, buttonMouseDownHandler);
    pin.removeEventListener(`keydown`, buttonKeyDownHandler);
  }
};

// Вешаем 2 обработчика событий на главную метку
pin.addEventListener(`keydown`, buttonKeyDownHandler);
pin.addEventListener(`mousedown`, buttonMouseDownHandler);

// Нужна функция, которая проверяет, есть ли карта и удаляет ее из разметки
const deleteCard = () => {
  const card = adverts.querySelector(`.map__card`);
  if (card) {
    adverts.removeChild(card);
  }
};

// Удаление обработчикв закрытия карточки
const removeEventsCard = () => {
  document.removeEventListener(`click`, buttonClickHandler);
  document.removeEventListener(`keydown`, keydownEscapeHandler);
};

// Функция деактивации: удаляются метки, деактивируется карта
// блокируются фильтры, форма.
const deactivatePage = () => {
  adverts.classList.add(`map--faded`);
  window.form.advert.reset();
  window.form.advert.classList.add(`ad-form--disabled`);

  // Блокируем изменение атрибутов формы
  Array.prototype.forEach.call(window.form.advert.children, (childAdvertForm) => {
    childAdvertForm.setAttribute(`disabled`, `disabled`);
  });

  // Блокируем изменение атрибутов блока фильтров
  deactivateFormFilter();

  // Записать начальные данные координат в форму объявления
  window.form.advert.querySelector(`#address`).setAttribute(`value`, `${LEFT_MAIN_PIN_MAP}, ${TOP_MAIN_PIN_MAP}`);
  // Поставить метку в центр карты
  pin.style.left = `${LEFT_MAIN_PIN}px`;
  pin.style.top = `${TOP_MAIN_PIN}px`;

  // Если есть карточка с характеристиками обьявления, то удаляем ее из разметки
  deleteCard();

  // Удаление меток
  removePins();

  // Вешаем заново 2 обработчика событий на главную метку
  pin.addEventListener(`keydown`, buttonKeyDownHandler);
  pin.addEventListener(`mousedown`, buttonMouseDownHandler);
};

deactivatePage();
// Функции обработчик удаления карточки из разметки
const buttonClickHandler = () => {
  deleteCard();
  removeEventsCard();
};

const keydownEscapeHandler = (evt) => {
  if (evt.key === window.util.ESCAPE) {
    deleteCard();
    removeEventsCard();
  }
};

// Обработчик события клика мыши на метке для отображения карточки объявления
adverts.addEventListener(`click`, (evt) => {
  // Опеределяем, где именно произошло событие
  let target = evt.target;
  // Если на изображении метки, то присваем его предку (button)(самой метке)
  if (target.tagName === `IMG`) {
    target = target.parentNode;
  }
  // Если метка содержит класс `map__pin` и не содержит класс `map__pin--main`, то есть не является главной
  if ((target.classList.contains(`map__pin`)) && (!target.classList.contains(`map__pin--main`))) {
    const pinActive = document.querySelector(`.map__pins .map__pin--active`);

    // Проверить существование класса map__pin--active у предыдущей активной метки, и удалить его
    if (pinActive) {
      pinActive.classList.remove(`map__pin--active`);
    }

    // Текущей метке добавить класс map__pin--active
    target.classList.add(`map__pin--active`);

    // Если уже есть карточка с характеристиками обьявления, то удаляем ее из разметки
    deleteCard();

    // Отображаем карточку объявлений соответствующую метке.
    adverts.insertBefore(window.card.render(filteredRealEstates[target.dataset.index]), adverts.children[1]);

    // Находим кнопку-крестик в окне отображения карточки
    const closePopup = document.querySelector(`.popup__close`);
    // Вешаем обработчик, в котором по клику скрываем блок карточки
    closePopup.addEventListener(`click`, buttonClickHandler);

    // После этого нужно повесить обработчики на закрыитие карты
    // Вешаем обработчик, который перехватывает нажатие клавиши ESC
    document.addEventListener(`keydown`, keydownEscapeHandler);
  }
});

// Экспорт данных
window.map = {
  HALF_WIDTH_MAIN_PIN,
  HALF_HEIGHT_MAIN_PIN,
  adverts,
  pin,
  getRealEstate,
  setFilteredRealEstates,
  deactivatePage,
  removePins,
  renderPinsJSON
};
