'use strict';

(function () {
  const URL = 'https://21.javascript.pages.academy/keksobooking';

  const uploadData = function (data, onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', URL);
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      let error = '';
      switch (xhr.status) {
        case 200:
          onSuccess();
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

    xhr.send(data);
  };

  window.upload = {
    uploadData: uploadData
  };

})();
