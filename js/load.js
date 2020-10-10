'use strict';

// Модуль загрузки данных с сервера
// 1. Сделать запрос на получение JSON данных с сервера
// 2. Проверить, что запрос выполнился успешно, если нет, то обработать все исключения
// 3. Передать полученные данные для отрисовки меток на карте.

(function () {

  const URL = 'https://21.javascript.pages.academy/keksobooking/data';

  const downloadData = function (onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL);
    xhr.responseType = 'json';


    xhr.addEventListener('load', function () {
      let error = '';
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;
        default:
          error = `Статус ответа: ${xhr.status} ${xhr.statusText}`;
      }
      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 20000; // 20s
    xhr.send();
  };

  window.load = {
    downloadData: downloadData
  };
})();
