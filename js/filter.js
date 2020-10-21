'use strict';

// Данный модуль отвечает за работу фильтров
// В нём будет находится функция фильтрации
// Фильтрация начинает работать  возникает событие change на форме фильтрации

(function () {
  // Находим блок фильтров в DOM
  const formFilters = document.querySelector('.map__filters');
  const housingValues = formFilters.querySelectorAll('.map__filter');
  const featuresValues = formFilters.querySelector('.map__features').querySelectorAll('.map__checkbox');

  // Получаем начальные данных формы фильтров
  let dataFormFilters = new FormData(formFilters);

  // Функция фильтрации массива
  const filtrationRealEstates = function () {
    // Проверяем, есть ли карточка объявления, если есть и она не скрыта, то скрываем её
    if (window.map.mapAdverts.querySelector('.map__card')) {
      if (!window.map.mapAdverts.querySelector('.map__card').classList.contains('hidden')) {
        window.map.mapAdverts.querySelector('.map__card').classList.add('hidden');
      }
    }
    // Очищаем карту от предыдущих меток
    window.map.removePins();
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
    // Функция проверки по цене, если у объекта недвижимости и фильтра по цене данные совпадают, то вернут true
    const checkFilterPrice = function (realEstatePrice) {
      // Булева переменная, если true, то подходит объект недвижимости по значению цены
      let priceFilter = false;
      if (valuesFormFilters.get('price') === 'middle') {
        if ((realEstatePrice < window.data.FILTER_PRICE['high']) &&
          (realEstatePrice > window.data.FILTER_PRICE['low'])) {
          priceFilter = true;
        }
      }

      if (valuesFormFilters.get('price') === 'high') {
        if (realEstatePrice > window.data.FILTER_PRICE['high']) {
          priceFilter = true;
        }
      }

      if (valuesFormFilters.get('price') === 'low') {
        if (realEstatePrice < window.data.FILTER_PRICE['low']) {
          priceFilter = true;
        }
      }
      return priceFilter;
    };

    const checkFilterFeatures = function (realEstateFeatures) {
      // Булева переменная, если true, то подходит объект нидвижимости по значению цены
      let featuresFilter = true;
      // Проверяем, выбраны ли фильтры features в форме
      if (valuesFeatures.length !== 0) {
        // Проверяем, есть ли фильтры features в объявлении
        if (realEstateFeatures.length !== 0) {
          // Цикл из количества выбранных фильтров
          for (let i = 0; i < valuesFeatures.length; i++) {
            // Проверить, есть ли значение данного фильтра features в массиве у объекта
            // если нет, то присвоить false
            if ((realEstateFeatures.indexOf(valuesFeatures[i])) === -1) {
              featuresFilter = false;
            }
          }
        } else {
          // Если фильтры выбраны, а массив features у объекта пустой, то присваиваем false, такой объект
          // не подходит по условиям фильтрации
          featuresFilter = false;
        }
      }
      // если фильтров не выбрано, либо условия фильтрации не наружены,
      // то возвращаем true,
      return featuresFilter;
    };

    // Используем встроенную функцию фильтрации, получаем новый массив соответсвующий выбранным фильтрам
    window.data.filterRealEstates = window.data.realEstates.filter(function (realEstate) {
      return ((realEstate['offer']['type'] === valuesFormFilters.get('type')) || (valuesFormFilters.get('type') === 'any')) &&
        ((checkFilterPrice(realEstate['offer']['price'])) || (valuesFormFilters.get('price') === 'any')) &&
        ((realEstate['offer']['rooms'] === Number(valuesFormFilters.get('rooms'))) || (valuesFormFilters.get('rooms') === 'any')) &&
        ((realEstate['offer']['guests'] === Number(valuesFormFilters.get('guests'))) || (valuesFormFilters.get('guests') === 'any')) &&
        checkFilterFeatures(realEstate['offer']['features']);
    });

    window.map.renderPinsJSON();
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

  // Экспорт данных
  window.filter = {
    formFilters: formFilters
  };

})();
