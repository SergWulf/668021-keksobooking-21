'use strict';


// Константы для соответствия комнат к гостям и наоборот
const MAX_ROOMS = 100;
const MAX_GUESTS = 0;
const MESSAGE_ERROR_VALIDATION = `Количество гостей не соответствует количеству комнат: 1 комната - 1 гость, 2 комнаты - 1 или 2 гостя, 3 комнаты - 1, 2 или 3 гостя, 100 комнат - не для гостей`;

// Соответствие минимальной цены для объектов недвижимости
const TypeResidencePrice = {
  'palace': 10000,
  'house': 5000,
  'bungalow': 0,
  'flat': 1000
};

const URL_UPLOAD = `https://21.javascript.pages.academy/keksobooking`;

// Элементы формы DOM
const advert = document.querySelector(`.ad-form`);
const priceForm = document.querySelector(`#price`);
const typeOfHouseForm = document.querySelector(`#type`);
const timeInForm = document.querySelector(`#timein`);
const timeOutForm = document.querySelector(`#timeout`);
const roomNumberForm = document.querySelector(`#room_number`);
const capacityForm = document.querySelector(`#capacity`);

// 3. Тип жилья. В зависимости от типа, меняется минимальная цена и отображается в виде плейсхолдера.
// Валидация соответствия: вид жительста - минимальная цена
//     «Бунгало» — минимальная цена за ночь 0;
//     «Квартира» — минимальная цена за ночь 1 000;
//     «Дом» — минимальная цена 5 000;
//     «Дворец» — минимальная цена 10 000;
// Вместе с минимальным значением цены нужно изменять и плейсхолдер.

// Обработка первоначального значения формы
priceForm.setAttribute(`min`, TypeResidencePrice[typeOfHouseForm.options[typeOfHouseForm.selectedIndex].value]);
priceForm.setAttribute(`placeholder`, TypeResidencePrice[typeOfHouseForm.options[typeOfHouseForm.selectedIndex].value]);


// Вешаем обработчик на изменение типа жилья
typeOfHouseForm.addEventListener(`change`, (evt) => {
  priceForm.setAttribute(`min`, TypeResidencePrice[typeOfHouseForm.options[evt.currentTarget.selectedIndex].value]);
  priceForm.setAttribute(`placeholder`, TypeResidencePrice[typeOfHouseForm.options[evt.currentTarget.selectedIndex].value]);
});

// Валидация полей заезды и выезда
// Поля «Время заезда» и «Время выезда» синхронизированы:
// при изменении значения одного поля, во втором выделяется соответствующее ему.
// Например, если время заезда указано «после 14», то время выезда будет равно «до 14» и наоборот.
//
// 1. Обработка события на каждом поле
// 2. Если одно поле принимает определенное значение, то и другое поле, послы выбора значения, принимает тоже значение

timeInForm.addEventListener(`change`, () => {
  timeOutForm.options.selectedIndex = timeInForm.options.selectedIndex;
});

timeOutForm.addEventListener(`change`, () => {
  timeInForm.options.selectedIndex = timeOutForm.options.selectedIndex;
});

const validateGuestsInRoom = () => {
  // Сразу записываем сообщения об несоответствии комнат и гостей, в дальнейшем эти значения примут истинные значения
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

  // Основная проверка соответствия комнат гостям,
  // Если комнаты соответствуют гостям и поля не содержат максимальных значений,
  // или есть максимальные значения, но они в обоих полях, то всё валидно, иначе выводим сообщение!
  if ((expressionWithoutMaxValue && currentExpressionCondition) || (expressionWithMaxValue)) {
    capacityForm.setCustomValidity(``);
  }
};

roomNumberForm.addEventListener(`change`, () => {
  validateGuestsInRoom();
});

capacityForm.addEventListener(`change`, () => {
  validateGuestsInRoom();
});

// Обработчик формы
// 1. Перехватить стандартную отправку формы.
// 2. Собрать необходимые данные с формы с помощью FormData,
// 3. Отправить эти данные посредством xhr на сервер.
// 4. Если данные отправлены успешно, то необходимо сбросить форму и вернуть состояние страницы в неактивное.
// 4.1 После успешной отправки данных, необходимо отобразить сообщение, которое находится в template, ид #success,
//     Сообщение должно закрывать при нажатии кнопки Esc, либо по любому клику, вне формы окна.
// 4.2 Если данные отправились не успешно, то отобразить сообщение с ид #error из template, в секции main,
//     Сообщение должно исчезать по нажатию на кнопку .error__button, Esc и по любому клику за пределами сообщения.

const mainNode = document.querySelector(`main`);
// Коллбэк функция успешной отправки данных формы.
const getSuccessFormHandler = () => {
  window.map.deactivatePage();
  // Найти template Success и отобразить его, повесить обработчик на закрытие
  const templateSuccess = document.querySelector(`#success`).content.querySelector(`.success`);
  const successPopup = templateSuccess.cloneNode(true);
  mainNode.appendChild(successPopup);
  successPopup.setAttribute(`tabindex`, `0`);
  successPopup.focus();

  // Обработчики закрытия окна
  successPopup.addEventListener(`click`, () => {
    // Удалить окно из разметки
    mainNode.removeChild(mainNode.lastChild);
  });

  successPopup.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Escape`) {
      // Удалить окно из разметки
      mainNode.removeChild(mainNode.lastChild);
    }
  });
};

// Коллбэк функция, если возникла ошибка в отправке данных
const getErrorHandler = (message) => {
  // Найти template Error и отобразить его, повесить обработчик на закрытие
  const templateError = document.querySelector(`#error`).content.querySelector(`.error`);
  const errorPopup = templateError.cloneNode(true);
  errorPopup.querySelector(`p`).textContent = message;
  mainNode.appendChild(errorPopup);
  errorPopup.setAttribute(`tabindex`, `0`);
  errorPopup.focus();
  // Обработчики закрытия окна

  errorPopup.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Escape`) {
      // Удалить окно из разметки
      mainNode.removeChild(mainNode.lastChild);
    }
  });

  errorPopup.addEventListener(`click`, () => {
    // Удалить окно из разметки
    mainNode.removeChild(mainNode.lastChild);
  });

  errorPopup.querySelector(`.error__button`).addEventListener(`click`, () => {
    // Удалить окно из разметки
    mainNode.removeChild(mainNode.lastChild);
  });
};

advert.addEventListener(`submit`, (evt) => {
  evt.preventDefault();
  // Получаем данные с формы.
  let dataForm = new FormData(advert);
  // Вызываем функцию отправки данных формы
  window.load.requestData(getSuccessFormHandler, getErrorHandler, `POST`, URL_UPLOAD, dataForm);
});


// Обработчик кнопки сброса формы,
const buttonFormReset = document.querySelector(`.ad-form__reset`);
const buttonResetClickHandler = (evtReset) => {
  evtReset.preventDefault();
  // Деактивируем главную страницу и сбрасываем форму
  window.map.deactivatePage();
};

buttonFormReset.addEventListener(`click`, buttonResetClickHandler);

// Загрузка превью аватара и первой фотографии жилья
const fileChooserAvatar = document.querySelector(`.ad-form-header__upload input[type=file]`);
const previewAvatar = document.querySelector(`.ad-form-header__preview img`);

fileChooserAvatar.addEventListener(`change`, () => {
  const file = fileChooserAvatar.files[0];
  const reader = new FileReader();

  reader.addEventListener(`load`, () => {
    previewAvatar.src = reader.result;
  });

  reader.readAsDataURL(file);
});

const fileChooserRealEstatePicture = document.querySelector(`.ad-form__upload input[type=file]`);
const previewBlockRealEstate = document.querySelector(`.ad-form__photo`);
const previewRealEstatePicture = document.createElement(`img`);

// Выравнивание по центру содержимого в блоке
previewBlockRealEstate.style = `display: flex; justify-content: center; align-items: center`;

// Свойства картинки
previewRealEstatePicture.alt = `Фото жилья`;
previewRealEstatePicture.src = `img/muffin-grey.svg`;
previewRealEstatePicture.width = 40;
previewRealEstatePicture.height = 44;
previewBlockRealEstate.appendChild(previewRealEstatePicture);

fileChooserRealEstatePicture.addEventListener(`change`, () => {
  const file = fileChooserRealEstatePicture.files[0];
  const reader = new FileReader();

  reader.addEventListener(`load`, () => {
    previewRealEstatePicture.src = reader.result;
  });

  reader.readAsDataURL(file);
});

// Экспорт данных
window.form = {
  advert
};
