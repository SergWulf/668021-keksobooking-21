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
