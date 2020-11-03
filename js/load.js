'use strict';

// Модуль загрузки данных с сервера(и наоборот)
// 1. Сделать запрос на получение JSON данных с сервера
// 2. Проверить, что запрос выполнился успешно, если нет, то обработать все исключения

const onData = (onSuccess, onError, method, URL, data = undefined) => {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener(`load`, () => {
    let error = ``;
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

  xhr.addEventListener(`error`, () => {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
  });

  xhr.responseType = `json`;
  xhr.timeout = 20000; // 20s

  xhr.open(method, URL);
  xhr.send(data);
};

window.load = {
  onData
};
