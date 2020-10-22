'use strict';

// Данный модуль отвечает за работу фильтров
// В нём будет находится функция фильтрации
// Фильтрация начинает работать  возникает событие change на форме фильтрации

(function () {
  // Находим блок фильтров в DOM
  const formFilters = document.querySelector('.map__filters');

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
    // На основе данных создаем map со значениями фильтров selected
    const valuesFormFilters = new Map();
    // Создаем отдельный массив для хранения выбранных фильтров features
    const valuesFeatures = [];
    // Получаем выбранные значения фильтров из формы
    const checkedFilters = formFilters.querySelectorAll(':checked');
    for (let checkedFilter of checkedFilters) {
      if (checkedFilter.tagName === 'OPTION') {
        valuesFormFilters.set(window.data.FILTER_TYPE[checkedFilter.parentNode.name], checkedFilter.value);
      }
      if (checkedFilter.tagName === 'INPUT') {
        valuesFeatures.push(checkedFilter.value);
      }
    }

    // Функция проверки по цене, если у объекта недвижимости и фильтра по цене данные совпадают, то вернут true
    const isPrice = function (realEstatePrice) {
      // Булева переменная, если true, то подходит объект недвижимости по значению цены
      let priceFilter = false;

      switch (valuesFormFilters.get('price')) {
        case 'middle':
          priceFilter = (realEstatePrice <= window.data.FILTER_PRICE['high']) && (realEstatePrice >= window.data.FILTER_PRICE['low']);
          break;
        case 'high':
          priceFilter = ((valuesFormFilters.get('price') === 'high') && (realEstatePrice > window.data.FILTER_PRICE['high']));
          break;
        case 'low':
          priceFilter = ((valuesFormFilters.get('price') === 'low') && (realEstatePrice < window.data.FILTER_PRICE['low']));
      }

      return priceFilter || (valuesFormFilters.get('price') === 'any');
    };

    const isFeatures = function (realEstateFeatures) {
      // Булева переменная, если true, то подходит объект нидвижимости по значению цены
      let featuresFilter = true;
      // Проверяем, выбраны ли фильтры features в форме и есть ли фильтры features в объявлении
      if ((valuesFeatures.length !== 0) && (realEstateFeatures.length !== 0)) {
        // Цикл из количества выбранных фильтров
        for (let i = 0; i < valuesFeatures.length; i++) {
          // Проверить, есть ли значение данного фильтра features в массиве у объекта
          // если нет, то присвоить false
          if (!(realEstateFeatures.includes(valuesFeatures[i]))) {
            featuresFilter = false;
          }
        }
      } else if (valuesFeatures.length !== 0) {
        // Если фильтры выбраны, а массив features у объекта пустой,
        // то присваиваем false, такой объект не подходит по условиям фильтрации
        featuresFilter = false;
      }
      // если фильтров не выбрано, либо условия фильтрации не наружены,
      // то возвращаем true,
      return featuresFilter;
    };

    const isHousingType = function (realEstateType) {
      return realEstateType === valuesFormFilters.get('type') || valuesFormFilters.get('type') === 'any';
    };

    const isHousingRooms = function (realEstateRooms) {
      return realEstateRooms === valuesFormFilters.get('rooms') || valuesFormFilters.get('rooms') === 'any';
    };

    const isHousingGuests = function (realEstateGuests) {
      return realEstateGuests === valuesFormFilters.get('guests') || valuesFormFilters.get('guests') === 'any';
    };

    // Используем встроенную функцию фильтрации, получаем новый массив соответсвующий выбранным фильтрам
    window.data.filterRealEstates = window.data.realEstates.filter(function (realEstate) {
      return isHousingType(realEstate['offer']['type']) &&
        isPrice(realEstate['offer']['price']) &&
        isHousingRooms(realEstate['offer']['rooms']) &&
        isHousingGuests(realEstate['offer']['guests']) &&
        isFeatures(realEstate['offer']['features']);
    });

    window.map.renderPinsJSON();
  };

  // На каждое изменение формы фильтрации вызываем функцию фильтрации
  formFilters.addEventListener('change', filtrationRealEstates);

  // Экспорт данных
  window.filter = {
    formFilters: formFilters
  };

})();
