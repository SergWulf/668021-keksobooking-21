'use strict';

// Модуль карты: создание меток, отображение карточек, обработка событий

(function () {
  // Находим блок фильтров в DOM
  const formFilters = document.querySelector('.map__filters');
  const housingValues = formFilters.querySelectorAll('.map__filter');
  const featuresValues = formFilters.querySelector('.map__features').querySelectorAll('.map__checkbox');

  // Получаем начальные данных формы фильтров
  let dataFormFilters = new FormData(formFilters);

  // Находим карту объявлений и главную метку в DOM
  const mapAdverts = document.querySelector('.map');
  const mapPin = document.querySelector('.map__pin--main');

  // Функция отображения меток
  const renderPinsJSON = function () {
    // Находим блок, где будем отображать метки и отображаем их
    const blockPins = document.querySelector('.map__pins');
    blockPins.appendChild(window.pin.renderPins(window.data.filterRealEstates));
  };

  // Функция удаления меток
  const removePins = function () {
    // Находим и удаляем метки
    const blockPins = document.querySelector('.map__pins');
    const liveBlockPins = blockPins.children;

    // Подставляем значения по фильтрам
    if (liveBlockPins.length > 2) {
      for (let i = 0; i < window.data.currentCountShowPins; i++) {
        liveBlockPins[liveBlockPins.length - 1].remove();
      }
    }
  };

  // Функция фильтрации массива
  const filtrationRealEstates = function () {
    // Проверяем, есть ли карточка объявления, если есть и она не скрыта, то скрываем её
    if (mapAdverts.querySelector('.map__card')) {
      if (!mapAdverts.querySelector('.map__card').classList.contains('hidden')) {
        mapAdverts.querySelector('.map__card').classList.add('hidden');
      }
    }

    removePins();
    // Получаем данные формы фильтрации
    dataFormFilters = new FormData(formFilters);
    // На основе данных создаем map со значениями фильтров
    const valuesFormFilters = new Map();
    // Создаем отдельный массив для хранения выбранных фильтров формы features
    const valuesFeatures = [];
    for (let [name, value] of dataFormFilters) {
      if (name === 'features') {
        valuesFeatures.push(value);
      } else {
        valuesFormFilters.set(window.data.FILTER_TYPE[name], value);
      }

    }
    // Используем встроенную функцию фильтрации, получаем новый массив
    window.data.filterRealEstates = window.data.realEstates.filter(function (realEstate) {
      // В данной функции нужно определить, по каким фильтрам
      return ((realEstate['offer']['type'] === valuesFormFilters.get('type')) || (valuesFormFilters.get('type') === 'any')) &&
        ((
          (function () {
            if (valuesFormFilters.get('price') === 'middle') {
              if ((realEstate['offer']['price'] < window.data.FILTER_PRICE['high']) &&
                (realEstate['offer']['price'] > window.data.FILTER_PRICE['low'])) {
                return true;
              }
            }

            if (valuesFormFilters.get('price') === 'high') {
              if (realEstate['offer']['price'] > window.data.FILTER_PRICE['high']) {
                return true;
              }
            }

            if (valuesFormFilters.get('price') === 'low') {
              if (realEstate['offer']['price'] < window.data.FILTER_PRICE['low']) {
                return true;
              }
            }
            return false;
          })()
        ) || (valuesFormFilters.get('price') === 'any')) &&
        ((realEstate['offer']['rooms'] === Number(valuesFormFilters.get('rooms'))) || (valuesFormFilters.get('rooms') === 'any')) &&
        ((realEstate['offer']['guests'] === Number(valuesFormFilters.get('guests'))) || (valuesFormFilters.get('guests') === 'any')) &&
        (function () {
          // Проверяем, выбраны ли фильтры features в форме
          if (valuesFeatures.length !== 0) {
            // Проверяем, есть ли фильтры features в объявлении
            if (realEstate['offer']['features'].length !== 0) {
              // Цикл из количества выбранных фильтров
              for (let i = 0; i < valuesFeatures.length; i++) {
                // Проверить, есть ли значение данного фильтра features в массиве у объекта
                // Если есть, то булевой переменной присвоить true, если нет, то присвоить false
                // и сразу вернуть из анонимной функции false, то есть данный объект не подходит
                // по условиям фильтрации.
                if ((realEstate['offer']['features'].indexOf(valuesFeatures[i])) === -1) {
                  return false;
                }
              }
            } else {
              // Если фильтры выбраны, а массив features у объекта пустой, то возвращяем false, такой объект
              // не подходит по условиям фильтрации
              return false;
            }
          }
          // если фильтров не выбрано, то возвращаем true, то подходят объекты с любым количеством фильтров
          // либо фильтры выбраны, и нигде не сработало false, то есть в этом объекте есть значения данного фильтра
          return true;
        })();
    });

    renderPinsJSON();
  };

  // 2 цикла перебора коллекций (фильтров select и checkbox)
  // На каждый select и checkbox устанавливаем обработчик события change
  // в котором вызываем коллбэк функцию фильтрации

  for (let i = 0; i < housingValues.length; i++) {
    housingValues[i].addEventListener('change', filtrationRealEstates);
  }

  for (let i = 0; i < featuresValues.length; i++) {
    featuresValues[i].addEventListener('change', filtrationRealEstates);
  }

  const outError = function (message) {
    window.data.errorsJSON = message;
  };

  const getData = function (dataJSON) {
    window.data.realEstates = dataJSON;
    window.data.filterRealEstates = dataJSON;
    // Вызываем функцию отрисовки меток по JSON данным
    renderPinsJSON();
  };

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
    // Загружаем JSON данные после активации
    window.load.loadData(getData, outError, 'GET', window.data.URL_DOWNLOAD);
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

  // Функция деактивации: удаляются метки, деактивируется карта
  // блокируются фильтры, форма.
  const deactivationPage = function () {
    mapAdverts.classList.add('map--faded');
    window.form.adForm.reset();
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

    // Удаление меток
    removePins();

    // Вешаем заново 2 обработчика событий на главную метку
    mapPin.addEventListener('keydown', buttonKeyDownHandler);
    mapPin.addEventListener('mousedown', buttonMouseDownHandler);
  };

  deactivationPage();

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
      mapAdverts.insertBefore(window.card.renderCard(window.data.filterRealEstates[target.dataset.index]), mapAdverts.children[1]);
    }
  });

  // Вешаем обработчик, который перехватывает нажатие клавиши ESC на всей карте.
  mapAdverts.addEventListener('keydown', function (evt) {
    if ((mapAdverts.querySelector('.map__card')) && (evt.key === 'Escape')) {
      mapAdverts.querySelector('.map__card').classList.add('hidden');
    }
  });

  // Экспорт данных
  window.map = {
    mapAdverts: mapAdverts,
    mapPin: mapPin,
    deactivationPage: deactivationPage
  };
})();

