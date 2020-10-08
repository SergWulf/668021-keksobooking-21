'use strict';

// Модуль карты: создание меток, отображение карточек, обработка событий

(function () {
  // Находим блок фильтров в DOM
  const formFilters = document.querySelector('.map__filters');

  // Находим карту объявлений и главную метку в DOM
  const mapAdverts = document.querySelector('.map');
  const mapPin = document.querySelector('.map__pin--main');

  // Функция деактивации: удаляются метки, деактивируется карта
  // блокируются фильтры, форма.
  const deactivationPage = function () {
    mapAdverts.classList.add('map--faded');
    window.form.adForm.classList.add('ad-form--disabled');

    // Блокируем изменение атрибутов формы
    for (let i = 0; i < window.form.adForm.children.length; i++) {
      window.form.adForm.children[i].setAttribute('disabled', 'disabled');
    }

    // Блокируем изменение атрибутов блока фильтров
    for (let i = 0; i < formFilters.children.length; i++) {
      formFilters.children[i].setAttribute('disabled', 'disabled');
    }

    // Записать начальные данные координат в форму объявления
    window.form.adForm.querySelector('#address').setAttribute('value', window.data.LEFT_MAP_PIN + ', ' + window.data.TOP_MAP_PIN);
    // Поставить метку в центр карты
    mapPin.style.left = `${window.data.LEFT_MAP_PIN - window.data.HALF_WIDTH_MAIN_PIN}px`;
    mapPin.style.top = `${window.data.TOP_MAP_PIN - window.data.HALF_HEIGHT_MAIN_PIN}px`;
  };

  deactivationPage();

  // Функция активации: рисуются метки, активируется карта
  // блок фильтров, форма.
  const activationPage = function () {
    mapAdverts.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');
    formFilters.classList.remove('ad-form--disabled');
    for (let i = 0; i < window.form.adForm.children.length; i++) {
      window.form.adForm.children[i].removeAttribute('disabled');
    }
    for (let i = 0; i < formFilters.children.length; i++) {
      formFilters.children[i].removeAttribute('disabled');
    }

    // Создание объектов JS на основе созданных данных
    window.data.realEstates = window.data.createRealEstates(window.data.COUNT_REAL_ESTATE);
    // Находим блок, где будем отображать метки и отображаем их
    const blockPins = document.querySelector('.map__pins');
    blockPins.appendChild(window.pin.renderPins(window.data.realEstates));
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
      mapAdverts.insertBefore(window.card.renderCard(window.data.realEstates[target.dataset.index]), mapAdverts.children[1]);
    }
  });

  // Вешаем обработчик, который перехватывает нажатие клавиши ESC на всей карте.
  mapAdverts.addEventListener('keydown', function (evt) {
    if ((mapAdverts.querySelector('.map__card')) && (evt.key === 'Escape')) {
      mapAdverts.querySelector('.map__card').classList.add('hidden');
    }
  });

  // Пока не совсем понял, куда запихнуть обработчик кнопки сброса формы,
  // модуль "form.js" у меня идёт до модуля "map.js",
  // Но в модуле формы я не могу его объявить, потому что он использует данные модуля "map.js"
  // Пока здесь размещу, дальше по ходу разберусь, как правильно.
  const buttonFormReset = document.querySelector('.ad-form__reset');
  const buttonResetClickHandler = function (evtReset) {
    evtReset.preventDefault();
    window.form.adForm.reset();
    // Деактивируем главную страницу
    deactivationPage();
    // Находим и удаляем метки
    const blockPins = document.querySelector('.map__pins');
    for (let i = 0; i < window.data.realEstates.length; i++) {
      blockPins.removeChild(blockPins.lastChild);
    }
    // Вешаем заново 2 обработчика событий на главную метку
    mapPin.addEventListener('keydown', buttonKeyDownHandler);
    mapPin.addEventListener('mousedown', buttonMouseDownHandler);
  };

  buttonFormReset.addEventListener('click', buttonResetClickHandler);

  // Экспорт данных
  window.map = {
    mapAdverts: mapAdverts,
    mapPin: mapPin
  };
})();

