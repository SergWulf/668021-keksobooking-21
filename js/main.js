'use strict';

// Главный модуль

(function () {
  // Создаем список скриптов в правильной зависимости
  const scripts = ['data.js', 'pin.js', 'card.js', 'form.js', 'map.js'];

  // Создаем fragment для списков
  const fragmentScripts = document.createDocumentFragment();

  // В цикле подключаем скрипты на главной странице
  for (let i = 0; i < scripts.length; i++) {
    const script = document.createElement('script');
    script.src = `js/${scripts[i]}`;
    fragmentScripts.appendChild(script);
  }

  document.body.appendChild(fragmentScripts);
})();


