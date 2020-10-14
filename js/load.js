'use strict';

// Модуль загрузки данных с сервера(и наоборот)
// 1. Сделать запрос на получение JSON данных с сервера
// 2. Проверить, что запрос выполнился успешно, если нет, то обработать все исключения

(function () {

  const URL_DOWNLOAD = 'https://21.javascript.pages.academy/keksobooking/data';
  const URL_UPLOAD = 'https://21.javascript.pages.academy/keksobooking';

  const loadData = function (data, onSuccess, onError) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      let error = '';
      switch (xhr.status) {
        case 200:
          if (!data) {
            onSuccess(xhr.response);
          } else {
            onSuccess();
          }
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

    xhr.responseType = 'json';
    xhr.timeout = 20000; // 20s

    if (!data) {
      xhr.open('GET', URL_DOWNLOAD);
      xhr.send();
    } else {
      xhr.open('POST', URL_UPLOAD);
      xhr.send(data);
    }
  };

  window.load = {
    loadData: loadData
  };
})();
