'use strict';

// Модуль карты: создание меток, отображение карточек, обработка событий

// Находим карту объявлений и главную метку в DOM
const adverts = document.querySelector(`.map`);
const pin = document.querySelector(`.map__pin--main`);

// Функция отображения меток
const renderPinsJSON = () => {
  // Находим блок, где будем отображать метки и отображаем их
  const blockPins = document.querySelector(`.map__pins`);
  blockPins.appendChild(window.pin.render(window.data.filterRealEstates));
};

// Функция удаления меток
const removePins = () => {
  // Находим и удаляем метки
  const pins = document.querySelectorAll(`.map__pin:not(.map__pin--main`);
  // Успешно скомуниздил со stackoverflow.com ))
  // Понял что пробегает по меткам, и удаляет их,
  // но как он их делает живыми, то есть как он связывается с node
  // В общем много чего не понял(prototype, call), но красивый код, всё работает,
  // почитаю сегодня подробней об этом ))))
  Array.prototype.forEach.call(pins, (node) => {
    node.parentNode.removeChild(node);
  });
};

const getData = (dataJSON) => {
  // Если в каком-то объекте отсутствует поле offer, то удаляем его,
  // также удаляем объекты без полей author и location
  let dataWithOffer = dataJSON.filter((realEstate) => {
    return realEstate[`offer`] && realEstate[`author`] && realEstate[`location`];
  });
  window.data.realEstates = dataWithOffer;
  window.data.filterRealEstates = dataWithOffer;
  // Так как данные успешно получены, активируем форму фильтрации
  window.filter.activateForm();
  // Вызываем функцию отрисовки меток по JSON данным
  renderPinsJSON();
};

// Коллбэк функция успешной отправки данных формы.
const getError = (message) => {
  const errorPopup = document.createElement(`DIV`);
  errorPopup.classList.add(`error`);
  const errorText = document.createElement(`P`);
  errorText.classList.add(`error__message`);
  errorText.textContent = message;
  errorPopup.appendChild(errorText);
  errorPopup.setAttribute(`tabindex`, `0`);
  errorPopup.focus();
  document.querySelector(`main`).appendChild(errorPopup);

  // Обработчики закрытия окна
  errorPopup.addEventListener(`click`, () => {
    // Удалить окно из разметки
    document.querySelector(`main`).removeChild(document.querySelector(`main`).lastChild);
  });

  errorPopup.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Escape`) {
      // Удалить окно из разметки
      document.querySelector(`main`).removeChild(document.querySelector(`main`).lastChild);
    }
  });
};

// Функция активации: рисуются метки, активируется карта
// форма.
const activatePage = () => {
  adverts.classList.remove(`map--faded`);
  window.form.advert.classList.remove(`ad-form--disabled`);
  for (let i = 0; i < window.form.advert.children.length; i++) {
    window.form.advert.children[i].removeAttribute(`disabled`);
  }
  // Загружаем JSON данные после активации
  window.load.onData(getData, getError, `GET`, window.data.URL_DOWNLOAD);
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
  if (evt.key === `Enter`) {
    activatePage();
    // Удаляем обработчики
    pin.removeEventListener(`mousedown`, buttonMouseDownHandler);
    pin.removeEventListener(`keydown`, buttonKeyDownHandler);
  }
};

// Вешаем 2 обработчика событий на главную метку
pin.addEventListener(`keydown`, buttonKeyDownHandler);
pin.addEventListener(`mousedown`, buttonMouseDownHandler);

// Функция деактивации: удаляются метки, деактивируется карта
// блокируются фильтры, форма.
const deactivatePage = () => {
  adverts.classList.add(`map--faded`);
  window.form.advert.reset();
  window.form.advert.classList.add(`ad-form--disabled`);

  // Блокируем изменение атрибутов формы
  for (let i = 0; i < window.form.advert.children.length; i++) {
    window.form.advert.children[i].setAttribute(`disabled`, `disabled`);
  }

  // Блокируем изменение атрибутов блока фильтров
  for (let i = 0; i < window.filter.form.children.length; i++) {
    window.filter.form.children[i].setAttribute(`disabled`, `disabled`);
  }

  // Записать начальные данные координат в форму объявления
  window.form.advert.querySelector(`#address`).setAttribute(`value`, window.data.LEFT_MAP_PIN + `, ` + window.data.TOP_MAP_PIN);
  // Поставить метку в центр карты
  pin.style.left = `${window.data.LEFT_MAP_PIN - window.data.HALF_WIDTH_MAIN_PIN}px`;
  pin.style.top = `${window.data.TOP_MAP_PIN - window.data.HALF_HEIGHT_MAIN_PIN}px`;

  // Если есть карточка с характеристиками обьявления, то удаляем ее из разметки
  if (adverts.querySelector(`.map__card`)) {
    adverts.removeChild(adverts.querySelector(`.map__card`));
  }

  // Удаление меток
  removePins();

  // Вешаем заново 2 обработчика событий на главную метку
  pin.addEventListener(`keydown`, buttonKeyDownHandler);
  pin.addEventListener(`mousedown`, buttonMouseDownHandler);
};

deactivatePage();

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
    if (adverts.querySelector(`.map__card`)) {
      adverts.removeChild(adverts.querySelector(`.map__card`));
    }
    // Отображаем карточку объявлений соответствующую метке.
    adverts.insertBefore(window.card.render(window.data.filterRealEstates[target.dataset.index]), adverts.children[1]);
  }
});


// Вешаем обработчик, который перехватывает нажатие клавиши ESC на всей карте.
adverts.addEventListener(`keydown`, (evt) => {
  if ((adverts.querySelector(`.map__card`)) && (evt.key === `Escape`)) {
    adverts.querySelector(`.map__card`).classList.add(`hidden`);
  }
});

// Экспорт данных
window.map = {
  adverts,
  pin,
  deactivatePage,
  removePins,
  renderPinsJSON
};
