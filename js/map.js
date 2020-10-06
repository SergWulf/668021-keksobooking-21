'use strict';

// Модуль карты: создание меток, отображение карточек, обработка событий

(function () {
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

  // Узнаем координаты  центра главной метки еще до активации страницы и записываем его в поле формы адреса
  const LEFT_MAP_PIN = mapPin.offsetLeft + window.data.HALF_WIDTH_MAIN_PIN;
  const TOP_MAP_PIN = mapPin.offsetTop + window.data.HALF_HEIGHT_MAIN_PIN;
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
})();

