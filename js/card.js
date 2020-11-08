'use strict';

// Модуль отрисовки карточки

const TypeResidence = {
  'palace': `Дворец`,
  'house': `Дом`,
  'bungalow': `Бунгало`,
  'flat': `Квартира`
};

// Соотношение полей объекта полям карточки
const FieldClass = {
  'title': `.popup__title`,
  'address': `.popup__text--address`,
  'price': `.popup__text--price`,
  'type': `.popup__type`,
  'rooms': `.popup__text--capacity`,
  'checkin': `.popup__text--time`,
  'features': `.popup__features`,
  'description': `.popup__description`,
  'photos': `.popup__photos`,
  'avatar': `.popup__avatar`
};

// Создаем шаблон для отображения карточки объекта недвижимости
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

// Функция проверки списка удобств
const checkFeaturesField = (data, field) => {
  // Удаляем все виды услуг из разметки
  while (field.firstChild) {
    field.removeChild(field.firstChild);
  }
  if (data.length > 0) {
    // Добавляем нужные услуги в разметку
    data.forEach((item) => {
      const elementFeature = document.createElement(`li`);
      elementFeature.className = `popup__feature popup__feature--${item}`;
      field.appendChild(elementFeature);
    });
  } else {
    field.classList.add(`visually-hidden`);
  }
};

// Функция проверки списка фотографий, если они есть, то отображаем в карточке
const checkPhotosField = (data, field) => {
  if (data.length > 0) {
    data.forEach((item) => {
      const popupPhoto = field.querySelector(`img`).cloneNode(true);
      popupPhoto.src = item;
      field.appendChild(popupPhoto);
    });
    // Удаляем шаблонную фотокарточку.
    field.children[0].remove();
  } else {
    field.classList.add(`visually-hidden`);
  }
};

// Основная проверка полей по типу в карточке
const checkField = (data, index, field) => {
  if (data[index]) {
    field.classList.remove(`visually-hidden`);
    switch (index) {
      case `type`:
        field.textContent = TypeResidence[data[index]];
        break;
      case `price`:
        field.textContent = `${data[index]} ${field.textContent}`;
        break;
      case `rooms`:
        field.textContent = `${data[index]} комнаты для ${data[`guests`]} гостей`;
        break;
      case `checkin`:
        field.textContent = `Заезд после ${data[index]}, выездо до ${data[`checkout`]}`;
        break;
      case `features`:
        checkFeaturesField(data[index], field);
        break;
      case `photos`:
        checkPhotosField(data[index], field);
        break;
      default:
        field.textContent = data[index];
    }
  }
};

const checkAvatarField = (data, field) => {
  if (data) {
    field.src = data;
    field.classList.remove(`visually-hidden`);
  }
};

// Функция отображения карточки, если данных для заполнения блока не хватает, то блок скрывается
const render = (realEstateCard) => {
  const cardElement = cardTemplate.cloneNode(true);

  // Скрываем все поля карточки по-умолчанию для удобства в будущих проверках
  const fieldsCard = cardElement.children;
  Array.prototype.forEach.call(fieldsCard, (fieldCard) => {
    if (!fieldCard.classList.contains(`popup__close`)) {
      fieldCard.classList.add(`visually-hidden`);
    }
  });

  // Основной цикл по поляем карточек и вызов соотвествующей функции обработки
  Object.getOwnPropertyNames(FieldClass).forEach((i) => {
    const fieldCard = cardElement.querySelector(FieldClass[i]);
    if (i === `avatar`) {
      checkAvatarField(realEstateCard[`author`][i], fieldCard);
    } else {
      checkField(realEstateCard[`offer`], i, fieldCard);
    }
  });

  return cardElement;
};

window.card = {
  render
};
