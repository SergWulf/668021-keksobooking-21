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
  const popupTitle = cardElement.querySelector(`.popup__title`);
  if (realEstateCard[`offer`][`title`]) {
    popupTitle.textContent = realEstateCard[`offer`][`title`];
  } else {
    popupTitle.classList.add(`visually-hidden`);
  }
  const popupAddress = cardElement.querySelector(`.popup__text--address`);
  if (realEstateCard[`offer`][`address`]) {
    popupAddress.textContent = realEstateCard[`offer`][`address`];
  } else {
    popupAddress.classList.add(`visually-hidden`);
  }
  const popupPrice = cardElement.querySelector(`.popup__text--price`);
  if (realEstateCard[`offer`][`price`]) {
    popupPrice.innerHTML = `${realEstateCard[`offer`][`price`]}&#x20bd;<span>/ночь</span>`;
  } else {
    popupPrice.classList.add(`visually-hidden`);
  }
  const popupType = cardElement.querySelector(`.popup__type`);
  if (realEstateCard[`offer`][`type`]) {
    popupType.textContent = TYPE_RESIDENCE[realEstateCard[`offer`][`type`]];
  } else {
    popupType.classList.add(`visually-hidden`);
  }
  const popupCapacity = cardElement.querySelector(`.popup__text--capacity`);
  if (realEstateCard[`offer`][`rooms`]) {
    popupCapacity.textContent = `${realEstateCard[`offer`][`rooms`]} комнаты для ${realEstateCard[`offer`][`guests`]} гостей`;
  } else {
    popupCapacity.classList.add(`visually-hidden`);
  }
  const popupTime = cardElement.querySelector(`.popup__text--time`);
  if ((realEstateCard[`offer`][`checkin`]) && (realEstateCard[`offer`][`checkout`])) {
    popupTime.textContent = `Заезд после ${realEstateCard[`offer`][`checkin`]}, выездо до ${realEstateCard[`offer`][`checkout`]}`;
  } else {
    popupTime.classList.add(`visually-hidden`);
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
  const popupDescription = cardElement.querySelector(`.popup__description`);
  if (realEstateCard[`offer`][`description`]) {
    popupDescription.textContent = realEstateCard[`offer`][`description`];
  } else {
    popupDescription.classList.add(`visually-hidden`);
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

  const popupAvatar = cardElement.querySelector(`.popup__avatar`);
  if (realEstateCard[`author`][`avatar`]) {
    popupAvatar.src = realEstateCard[`author`][`avatar`];
  } else {
    popupAvatar.classList.add(`visually-hidden`);
  }

  return cardElement;
};

window.card = {
  render
};
