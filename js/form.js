'use strict';

(function () {

  // Константы для соответствия комнат к гостям и наоборот
  const MAX_ROOMS = 100;
  const MAX_GUESTS = 0;
  const MESSAGE_ERROR_VALIDATION = 'Количество гостей не соответствует количеству комнат: 1 комната - 1 гость, 2 комнаты - 1 или 2 гостя, 3 комнаты - 1, 2 или 3 гостя, 100 комнат - не для гостей';

  // Элементы формы DOM
  const adForm = document.querySelector('.ad-form');
  const titleForm = document.querySelector('#title');
  const priceForm = document.querySelector('#price');
  const addressForm = document.querySelector('#address');
  const typeOfHouseForm = document.querySelector('#type');
  const timeInForm = document.querySelector('#timein');
  const timeOutForm = document.querySelector('#timeout');
  const avatarForm = document.querySelector('#avatar');
  const imagesForm = document.querySelector('#images');

  const roomNumberForm = document.querySelector('#room_number');
  const capacityForm = document.querySelector('#capacity');


  // Функция ограничений для полей ввода формы объявлений, до валидации формы
  const createAttributesForm = function () {

    // 0. Найти форму в DOM, установить ей атрибут action = "https://javascript.pages.academy/keksobooking"
    adForm.setAttribute('action', 'https://javascript.pages.academy/keksobooking');

    // 1. Найти заголовок объявления в разметке, установить для него атрибуты: обязательное текстовое, минимальное длина 30 сим, максимальная 100 символов.
    titleForm.setAttribute('required', 'required');
    titleForm.setAttribute('minlength', '30');
    titleForm.setAttribute('maxlength', '100');

    // 2. Цена за ночь. Обязательное числовое поле. Максимальное значение 1 000 000.
    priceForm.setAttribute('required', 'required');
    priceForm.setAttribute('max', '1000000');

    // 3. Адрес, обязательное поле, недоступно для редактирования
    addressForm.setAttribute('readonly', 'readonly');

    // 4. Ограничение на тип загружаемых файлов, они могут быть только изображениями
    avatarForm.setAttribute('accept', 'image/*');
    imagesForm.setAttribute('accept', 'image/*');
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
  priceForm.setAttribute('min', window.data.TYPE_RESIDENCE_PRICE[typeOfHouseForm.options[typeOfHouseForm.selectedIndex].value]);
  priceForm.setAttribute('placeholder', window.data.TYPE_RESIDENCE_PRICE[typeOfHouseForm.options[typeOfHouseForm.selectedIndex].value]);


  // Вешаем обработчик на изменение типа жилья
  typeOfHouseForm.addEventListener('change', function (evt) {
    priceForm.setAttribute('min', window.data.TYPE_RESIDENCE_PRICE[typeOfHouseForm.options[evt.currentTarget.selectedIndex].value]);
    priceForm.setAttribute('placeholder', window.data.TYPE_RESIDENCE_PRICE[typeOfHouseForm.options[evt.currentTarget.selectedIndex].value]);
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

  // Обработчик формы
  // 1. Перехватить стандартную отправку формы.
  // 2. Собрать необходимые данные с формы с помощью FormData,
  // 3. Отправить эти данные посредством xhr на сервер.
  // 4. Если данные отправлены успешно, то необходимо сбросить форму и вернуть состояние страницы в неактивное.
  // 4.1 После успешной отправки данных, необходимо отобразить сообщение, которое находится в template, ид #success,
  //     Сообщение должно закрывать при нажатии кнопки Esc, либо по любому клику, вне формы окна.
  // 4.2 Если данные отправились не успешно, то отобразить сообщение с ид #error из template, в секции main,
  //     Сообщение должно исчезать по нажатию на кнопку .error__button, Esc и по любому клику за пределами сообщения.

  // Коллбэк функция успешной отправки данных формы.
  const successForm = function () {
    window.map.deactivationPage();
    // Найти template Success и отобразить его, повесить обработчик на закрытие
    const templateSuccess = document.querySelector('#success').content.querySelector('.success');
    const successPopup = templateSuccess.cloneNode(true);
    document.querySelector('main').appendChild(successPopup);
    successPopup.setAttribute('tabindex', '0');
    successPopup.focus();

    // Обработчики закрытия окна
    successPopup.addEventListener('click', function () {
      // Удалить окно из разметки
      document.querySelector('main').removeChild(document.querySelector('main').lastChild);
    });

    successPopup.addEventListener('keydown', function (evt) {
      if (evt.key === 'Escape') {
        // Удалить окно из разметки
        document.querySelector('main').removeChild(document.querySelector('main').lastChild);
      }
    });
  };

  // Коллбэк функция, если возникла ошибка в отправке данных
  const errorForm = function (message) {
    // Найти template Error и отобразить его, повесить обработчик на закрытие
    const templateError = document.querySelector('#error').content.querySelector('.error');
    const errorPopup = templateError.cloneNode(true);
    errorPopup.querySelector('p').textContent = message;
    document.querySelector('main').appendChild(errorPopup);
    errorPopup.setAttribute('tabindex', '0');
    errorPopup.focus();
    // Обработчики закрытия окна

    errorPopup.addEventListener('keydown', function (evt) {
      if (evt.key === 'Escape') {
        // Удалить окно из разметки
        document.querySelector('main').removeChild(document.querySelector('main').lastChild);
      }
    });

    errorPopup.addEventListener('click', function () {
      // Удалить окно из разметки
      document.querySelector('main').removeChild(document.querySelector('main').lastChild);
    });

    errorPopup.querySelector('.error__button').addEventListener('click', function () {
      // Удалить окно из разметки
      document.querySelector('main').removeChild(document.querySelector('main').lastChild);
    });
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    // Получаем данные с формы.
    let dataForm = new FormData(adForm);
    // Вызываем функцию отправки формы
    window.load.loadData(successForm, errorForm, 'POST', window.data.URL_UPLOAD, dataForm);
  });


  // Обработчик кнопки сброса формы,
  const buttonFormReset = document.querySelector('.ad-form__reset');
  const buttonResetClickHandler = function (evtReset) {
    evtReset.preventDefault();
    // Деактивируем главную страницу и сбрасываем форму
    window.map.deactivationPage();
  };

  buttonFormReset.addEventListener('click', buttonResetClickHandler);

  // Экспорт данных
  window.form = {
    adForm: adForm
  };
})();

