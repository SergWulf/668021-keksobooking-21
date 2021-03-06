'use strict';

// Данный модуль отвечает за работу фильтров
// В нём будет находится функция фильтрации
// Фильтрация начинает работать  возникает событие change на форме фильтрации

// Соответствие между названиями данных фильтров в форме и в объекте недвижимости FILTER
const FilterType = {
  'housing-price': `price`,
  'housing-type': `type`,
  'housing-rooms': `rooms`,
  'housing-guests': `guests`
};

// FILTER
const FilterPrice = {
  'high': 50000,
  'low': 10000
};

// Находим блок фильтров в DOM
const form = document.querySelector(`.map__filters`);

// Функция фильтрации массива
const filterRealEstates = () => {
  // Проверяем, есть ли карточка объявления, если есть и она не скрыта, то скрываем её
  const mapCard = window.map.adverts.querySelector(`.map__card`);
  if (mapCard) {
    if (!mapCard.classList.contains(`visually-hidden`)) {
      mapCard.classList.add(`visually-hidden`);
    }
  }
  // Очищаем карту от предыдущих меток
  window.map.removePins();
  // На основе данных создаем map со значениями фильтров selected
  const valuesFormFilters = new Map();
  // Создаем отдельный массив для хранения выбранных фильтров features
  const valuesFeatures = [];
  // Получаем выбранные значения фильтров из формы
  const checkedFilters = form.querySelectorAll(`:checked`);

  checkedFilters.forEach((checkedFilter) => {
    if (checkedFilter.tagName === window.util.OPTION) {
      valuesFormFilters.set(FilterType[checkedFilter.parentNode.name], checkedFilter.value);
    }
    if (checkedFilter.tagName === window.util.INPUT) {
      valuesFeatures.push(checkedFilter.value);
    }
  });

  // Функция проверки по цене, если у объекта недвижимости и фильтра по цене данные совпадают, то вернут true
  const isPrice = (realEstatePrice) => {
    // Булева переменная, если true, то подходит объект недвижимости по значению цены
    let priceFilter = false;

    switch (valuesFormFilters.get(`price`)) {
      case `middle`:
        priceFilter = (realEstatePrice <= FilterPrice[`high`]) && (realEstatePrice >= FilterPrice[`low`]);
        break;
      case `high`:
        priceFilter = ((valuesFormFilters.get(`price`) === `high`) && (realEstatePrice > FilterPrice[`high`]));
        break;
      case `low`:
        priceFilter = ((valuesFormFilters.get(`price`) === `low`) && (realEstatePrice < FilterPrice[`low`]));
    }

    return priceFilter || (valuesFormFilters.get(`price`) === `any`);
  };

  const isFeatures = (realEstateFeatures) => {
    // Булева переменная, если true, то подходит объект нидвижимости по значению цены
    let featuresFilter = true;
    // Проверяем, выбраны ли фильтры features в форме и есть ли фильтры features в объявлении
    if ((valuesFeatures.length !== 0) && (realEstateFeatures.length !== 0)) {
      // Цикл из количества выбранных фильтров
      valuesFeatures.forEach((item) => {
        // Проверить, есть ли значение данного фильтра features в массиве у объекта
        // если нет, то присвоить false
        if (!(realEstateFeatures.includes(item))) {
          featuresFilter = false;
        }
      });
    } else if (valuesFeatures.length !== 0) {
      // Если фильтры выбраны, а массив features у объекта пустой,
      // то присваиваем false, такой объект не подходит по условиям фильтрации
      featuresFilter = false;
    }
    // если фильтров не выбрано, либо условия фильтрации не наружены,
    // то возвращаем true,
    return featuresFilter;
  };

  const isHousingType = (realEstateType) => {
    return realEstateType === valuesFormFilters.get(`type`) || valuesFormFilters.get(`type`) === `any`;
  };

  const isHousingRooms = (realEstateRooms) => {
    return realEstateRooms === Number(valuesFormFilters.get(`rooms`)) || valuesFormFilters.get(`rooms`) === `any`;
  };

  const isHousingGuests = (realEstateGuests) => {
    return realEstateGuests === Number(valuesFormFilters.get(`guests`)) || valuesFormFilters.get(`guests`) === `any`;
  };

  // Используем встроенную функцию фильтрации, получаем новый массив соответсвующий выбранным фильтрам
  window.map.setFilteredRealEstates(window.map.getRealEstate().filter((realEstate) => {
    return isHousingType(realEstate[`offer`][`type`]) &&
      isPrice(realEstate[`offer`][`price`]) &&
      isHousingRooms(realEstate[`offer`][`rooms`]) &&
      isHousingGuests(realEstate[`offer`][`guests`]) &&
      isFeatures(realEstate[`offer`][`features`]);
  }));
  window.map.renderPinsJSON();
};

// На каждое изменение формы фильтрации вызываем функцию фильтрации
form.addEventListener(`change`, () => {
  window.util.debounce(filterRealEstates);
});

// Ловим нажатие клавишы Enter в форме у input features,
// вызываем событие click, чтобы запустить фильтрацию
form.addEventListener(`keydown`, (evt) => {
  let target = evt.target;
  if ((evt.key === window.util.ENTER) && (target.tagName === window.util.INPUT)) {
    target.click();
  }
});
