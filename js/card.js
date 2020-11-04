'use strict';

// Модуль отрисовки карточки

const TYPE_RESIDENCE = {
  'palace': `Дворец`,
  'house': `Дом`,
  'bungalow': `Бунгало`,
  'flat': `Квартира`
};

// Создаем шаблон для отображения карточки объекта недвижимости
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

// Функция отображения карточки, если данных для заполнения блока не хватает, то блок скрывается
const render = (realEstateCard) => {
  const cardElement = cardTemplate.cloneNode(true);
  if (realEstateCard[`offer`][`title`]) {
    cardElement.querySelector(`.popup__title`).textContent = realEstateCard[`offer`][`title`];
  } else {
    cardElement.querySelector(`.popup__title`).classList.add(`visually-hidden`);
  }
  if (realEstateCard[`offer`][`address`]) {
    cardElement.querySelector(`.popup__text--address`).textContent = realEstateCard[`offer`][`address`];
  } else {
    cardElement.querySelector(`.popup__text--address`).classList.add(`visually-hidden`);
  }
  if (realEstateCard[`offer`][`price`]) {
    cardElement.querySelector(`.popup__text--price`).innerHTML = `${realEstateCard[`offer`][`price`]}&#x20bd;<span>/ночь</span>`;
  } else {
    cardElement.querySelector(`.popup__text--price`).classList.add(`visually-hidden`);
  }
  if (realEstateCard[`offer`][`type`]) {
    cardElement.querySelector(`.popup__type`).textContent = TYPE_RESIDENCE[realEstateCard[`offer`][`type`]];
  } else {
    cardElement.querySelector(`.popup__type`).classList.add(`visually-hidden`);
  }
  if (realEstateCard[`offer`][`rooms`]) {
    cardElement.querySelector(`.popup__text--capacity`).textContent = `${realEstateCard[`offer`][`rooms`]} комнаты для ${realEstateCard[`offer`][`guests`]} гостей`;
  } else {
    cardElement.querySelector(`.popup__text--capacity`).classList.add(`visually-hidden`);
  }
  if ((realEstateCard[`offer`][`checkin`]) && (realEstateCard[`offer`][`checkout`])) {
    cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${realEstateCard[`offer`][`checkin`]}, выездо до ${realEstateCard[`offer`][`checkout`]}`;
  } else {
    cardElement.querySelector(`.popup__text--time`).classList.add(`visually-hidden`);
  }

  // В разметке находим блок предоставления услуг
  const popupFeatures = cardElement.querySelector(`.popup__features`);
  // Удаляем все виды услуг из разметки
  while (popupFeatures.firstChild) {
    popupFeatures.removeChild(popupFeatures.firstChild);
  }
  if (realEstateCard[`offer`][`features`] && (realEstateCard[`offer`][`features`].length !== 0)) {
    // Добавляем нужные услуги в разметку
    realEstateCard[`offer`][`features`].forEach((item) => {
      const elementFeature = document.createElement(`li`);
      elementFeature.className = `popup__feature popup__feature--${item}`;
      popupFeatures.appendChild(elementFeature);
    });
  } else {
    popupFeatures.classList.add(`visually-hidden`);
  }

  if (realEstateCard[`offer`][`description`]) {
    cardElement.querySelector(`.popup__description`).textContent = realEstateCard[`offer`][`description`];
  } else {
    cardElement.querySelector(`.popup__description`).classList.add(`visually-hidden`);
  }
  // Добавляем фотографии в карточку объекта недвижимости
  const popupPhotos = cardElement.querySelector(`.popup__photos`);

  if (realEstateCard[`offer`][`photos`] && (realEstateCard[`offer`][`photos`].length > 0)) {
    realEstateCard[`offer`][`photos`].forEach((item) => {
      const popupPhoto = popupPhotos.querySelector(`img`).cloneNode(true);
      popupPhoto.src = item;
      popupPhotos.appendChild(popupPhoto);
    });
    // Удаляем шаблонную фотокарточку.
    popupPhotos.children[0].remove();
  } else {
    popupPhotos.classList.add(`visually-hidden`);
  }


  if (realEstateCard[`author`][`avatar`]) {
    cardElement.querySelector(`.popup__avatar`).src = realEstateCard[`author`][`avatar`];
  } else {
    cardElement.querySelector(`.popup__avatar`).classList.add(`visually-hidden`);
  }

  // Находим кнопку-крестик в окне отображения карточки
  const closePopup = cardElement.querySelector(`.popup__close`);
  // Вешаем обработчик, в котором по клику скрываем блок карточки
  closePopup.addEventListener(`click`, () => {
    cardElement.classList.add(`hidden`);
  });

  return cardElement;
};

window.card = {
  render
};
