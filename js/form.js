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

  /*
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    console.log(adForm.getAttribute('action'));
   // adForm.submit();
  });
  */

  // Экспорт данных
  window.form = {
    adForm: adForm
  };
})();

