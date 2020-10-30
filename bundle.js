(()=>{"use strict";(()=>{const e=document.querySelector(".map__pin--main").offsetLeft+31,t=document.querySelector(".map__pin--main").offsetTop+31;window.data={COORDINATE_PIN_X:25,COORDINATE_PIN_Y:70,LEFT_MAP_PIN:e,TOP_MAP_PIN:t,HEIGHT_PIN_MAIN:82,WIDTH_PIN_MAIN:62,MIN_MAP_Y:130,MAX_MAP_Y:630,HALF_WIDTH_MAIN_PIN:31,HALF_HEIGHT_MAIN_PIN:31,TYPE_RESIDENCE:{palace:"Дворец",house:"Дом",bungalow:"Бунгало",flat:"Квартира"},TYPE_RESIDENCE_PRICE:{palace:1e4,house:5e3,bungalow:0,flat:1e3},realEstates:[],filterRealEstates:[],COUNT_SHOW_PINS:5,currentCountShowPins:5,errorsJSON:"",URL_UPLOAD:"https://21.javascript.pages.academy/keksobooking",URL_DOWNLOAD:"https://21.javascript.pages.academy/keksobooking/data",FILTER_TYPE:{"housing-price":"price","housing-type":"type","housing-rooms":"rooms","housing-guests":"guests"},FILTER_PRICE:{high:5e4,low:1e4}}})(),window.load={loadData:function(e,t,o,n,r){const a=new XMLHttpRequest;a.addEventListener("load",(function(){let o="";switch(a.status){case 200:e(a.response);break;default:o=`Статус ответа: ${a.status} ${a.statusText}`}o&&t(o)})),a.addEventListener("error",(function(){t("Произошла ошибка соединения")})),a.addEventListener("timeout",(function(){t("Запрос не успел выполниться за "+a.timeout+"мс")})),a.responseType="json",a.timeout=2e4,a.open(o,n),a.send(r)}},(()=>{const e=document.querySelector("#pin").content.querySelector(".map__pin"),t=function(t){const o=e.cloneNode(!0),n=Number(t.location.x)-window.data.COORDINATE_PIN_X,r=Number(t.location.y)-window.data.COORDINATE_PIN_Y;return o.style=`left: ${n}px; top: ${r}px;`,o.querySelector("img").src=t.author.avatar,o.querySelector("img").alt=t.offer.title,o};window.pin={renderPins:function(e){const o=document.createDocumentFragment();window.data.currentCountShowPins=e.length<window.data.COUNT_SHOW_PINS?e.length:window.data.COUNT_SHOW_PINS;for(let n=0;n<window.data.currentCountShowPins;n++){const r=t(e[n]);r.setAttribute("data-index",n),o.appendChild(r)}return o}}})(),(()=>{const e=document.querySelector("#card").content.querySelector(".map__card");window.card={renderCard:function(t){const o=e.cloneNode(!0);t.offer.title?o.querySelector(".popup__title").textContent=t.offer.title:o.querySelector(".popup__title").classList.add("visually-hidden"),t.offer.address?o.querySelector(".popup__text--address").textContent=t.offer.address:o.querySelector(".popup__text--address").classList.add("visually-hidden"),t.offer.price?o.querySelector(".popup__text--price").innerHTML=t.offer.price+"&#x20bd;<span>/ночь</span>":o.querySelector(".popup__text--price").classList.add("visually-hidden"),t.offer.type?o.querySelector(".popup__type").textContent=window.data.TYPE_RESIDENCE[t.offer.type]:o.querySelector(".popup__type").classList.add("visually-hidden"),t.offer.rooms?o.querySelector(".popup__text--capacity").textContent=`${t.offer.rooms} комнаты для ${t.offer.guests} гостей`:o.querySelector(".popup__text--capacity").classList.add("visually-hidden"),t.offer.checkin&&t.offer.checkout?o.querySelector(".popup__text--time").textContent=`Заезд после ${t.offer.checkin}, выездо до ${t.offer.checkout}`:o.querySelector(".popup__text--time").classList.add("visually-hidden");const n=o.querySelector(".popup__features");for(;n.firstChild;)n.removeChild(n.firstChild);if(0!==t.offer.features.length)for(let e=0;e<t.offer.features.length;e++){const o=document.createElement("li");o.className="popup__feature popup__feature--"+t.offer.features[e],n.appendChild(o)}else n.classList.add("visually-hidden");t.offer.description?o.querySelector(".popup__description").textContent=t.offer.description:o.querySelector(".popup__description").classList.add("visually-hidden");const r=o.querySelector(".popup__photos");if(t.offer.photos.length>0){for(let e=0;e<t.offer.photos.length;e++){const o=r.querySelector("img").cloneNode(!0);o.src=t.offer.photos[e],r.appendChild(o)}r.children[0].remove()}else r.classList.add("visually-hidden");return t.author.avatar?o.querySelector(".popup__avatar").src=t.author.avatar:o.querySelector(".popup__avatar").classList.add("visually-hidden"),o.querySelector(".popup__close").addEventListener("click",(function(){o.classList.add("hidden")})),o}}})(),(()=>{const e="Количество гостей не соответствует количеству комнат: 1 комната - 1 гость, 2 комнаты - 1 или 2 гостя, 3 комнаты - 1, 2 или 3 гостя, 100 комнат - не для гостей",t=document.querySelector(".ad-form"),o=document.querySelector("#title"),n=document.querySelector("#price"),r=document.querySelector("#address"),a=document.querySelector("#type"),d=document.querySelector("#timein"),i=document.querySelector("#timeout"),c=document.querySelector("#avatar"),s=document.querySelector("#images"),l=document.querySelector("#room_number"),u=document.querySelector("#capacity");t.setAttribute("action","https://javascript.pages.academy/keksobooking"),o.setAttribute("required","required"),o.setAttribute("minlength","30"),o.setAttribute("maxlength","100"),n.setAttribute("required","required"),n.setAttribute("max","1000000"),r.setAttribute("readonly","readonly"),c.setAttribute("accept","image/*"),s.setAttribute("accept","image/*"),n.setAttribute("min",window.data.TYPE_RESIDENCE_PRICE[a.options[a.selectedIndex].value]),n.setAttribute("placeholder",window.data.TYPE_RESIDENCE_PRICE[a.options[a.selectedIndex].value]),a.addEventListener("change",(function(e){n.setAttribute("min",window.data.TYPE_RESIDENCE_PRICE[a.options[e.currentTarget.selectedIndex].value]),n.setAttribute("placeholder",window.data.TYPE_RESIDENCE_PRICE[a.options[e.currentTarget.selectedIndex].value])}));const m=function(e){"timeout"===e.currentTarget.name?d.options.selectedIndex=i.options.selectedIndex:i.options.selectedIndex=d.options.selectedIndex};d.addEventListener("change",m),i.addEventListener("change",m);const p=function(t){l.setCustomValidity(e),u.setCustomValidity(e);const o=100===Number(l.options[l.selectedIndex].value),n=0===Number(u.options[u.selectedIndex].value),r=!o&&!n,a=n&&o;let d=l.options[l.selectedIndex].value>=u.options[u.selectedIndex].value;Boolean(t)&&"capacity"===t.currentTarget.name&&(d=u.options[u.selectedIndex].value<=l.options[l.selectedIndex].value),(r&&d||a)&&(l.setCustomValidity(""),u.setCustomValidity(""))};p(!1),l.addEventListener("change",p),u.addEventListener("change",p);const f=function(){window.map.deactivationPage();const e=document.querySelector("#success").content.querySelector(".success").cloneNode(!0);document.querySelector("main").appendChild(e),e.setAttribute("tabindex","0"),e.focus(),e.addEventListener("click",(function(){document.querySelector("main").removeChild(document.querySelector("main").lastChild)})),e.addEventListener("keydown",(function(e){"Escape"===e.key&&document.querySelector("main").removeChild(document.querySelector("main").lastChild)}))},w=function(e){const t=document.querySelector("#error").content.querySelector(".error").cloneNode(!0);t.querySelector("p").textContent=e,document.querySelector("main").appendChild(t),t.setAttribute("tabindex","0"),t.focus(),t.addEventListener("keydown",(function(e){"Escape"===e.key&&document.querySelector("main").removeChild(document.querySelector("main").lastChild)})),t.addEventListener("click",(function(){document.querySelector("main").removeChild(document.querySelector("main").lastChild)})),t.querySelector(".error__button").addEventListener("click",(function(){document.querySelector("main").removeChild(document.querySelector("main").lastChild)}))};t.addEventListener("submit",(function(e){e.preventDefault();let o=new FormData(t);window.load.loadData(f,w,"POST",window.data.URL_UPLOAD,o)})),document.querySelector(".ad-form__reset").addEventListener("click",(function(e){e.preventDefault(),window.map.deactivationPage()}));const _=document.querySelector(".ad-form-header__upload input[type=file]"),y=document.querySelector(".ad-form-header__preview img");_.addEventListener("change",(function(){const e=_.files[0],t=new FileReader;t.addEventListener("load",(function(){y.src=t.result})),t.readAsDataURL(e)}));const h=document.querySelector(".ad-form__upload input[type=file]"),E=document.querySelector(".ad-form__photo"),v=document.createElement("img");E.style="display: flex; justify-content: center; align-items: center",v.alt="Фото жилья",v.width=40,v.height=44,E.appendChild(v),h.addEventListener("change",(function(){const e=h.files[0],t=new FileReader;t.addEventListener("load",(function(){v.src=t.result})),t.readAsDataURL(e)})),window.form={adForm:t}})(),(()=>{let e=null;window.debounce=function(t){e&&window.clearTimeout(e),e=window.setTimeout(t,500)}})(),(()=>{const e=document.querySelector(".map__filters"),t=function(){window.map.mapAdverts.querySelector(".map__card")&&(window.map.mapAdverts.querySelector(".map__card").classList.contains("hidden")||window.map.mapAdverts.querySelector(".map__card").classList.add("hidden")),window.map.removePins();const t=new Map,o=[],n=e.querySelectorAll(":checked");for(let e of n)"OPTION"===e.tagName&&t.set(window.data.FILTER_TYPE[e.parentNode.name],e.value),"INPUT"===e.tagName&&o.push(e.value);window.data.filterRealEstates=window.data.realEstates.filter((function(e){return(e.offer.type===t.get("type")||"any"===t.get("type"))&&function(e){let o=!1;switch(t.get("price")){case"middle":o=e<=window.data.FILTER_PRICE.high&&e>=window.data.FILTER_PRICE.low;break;case"high":o="high"===t.get("price")&&e>window.data.FILTER_PRICE.high;break;case"low":o="low"===t.get("price")&&e<window.data.FILTER_PRICE.low}return o||"any"===t.get("price")}(e.offer.price)&&(e.offer.rooms===Number(t.get("rooms"))||"any"===t.get("rooms"))&&(e.offer.guests===Number(t.get("guests"))||"any"===t.get("guests"))&&function(e){let t=!0;if(0!==o.length&&0!==e.length)for(let n=0;n<o.length;n++)e.includes(o[n])||(t=!1);else 0!==o.length&&(t=!1);return t}(e.offer.features)})),window.map.renderPinsJSON()};e.addEventListener("change",(function(){window.debounce(t)})),e.addEventListener("keydown",(function(e){let t=e.target;"Enter"===e.key&&"INPUT"===t.tagName&&t.click()})),window.filter={formFilters:e,activationForm:function(){e.classList.remove("ad-form--disabled");for(let t=0;t<e.children.length;t++)e.children[t].removeAttribute("disabled")}}})(),(()=>{const e=document.querySelector(".map"),t=document.querySelector(".map__pin--main"),o=function(){document.querySelector(".map__pins").appendChild(window.pin.renderPins(window.data.filterRealEstates))},n=function(){const e=document.querySelectorAll(".map__pin:not(.map__pin--main");Array.prototype.forEach.call(e,(function(e){e.parentNode.removeChild(e)}))},r=function(e){let t=e.filter((function(e){return e.offer&&e.author&&e.location}));window.data.realEstates=t,window.data.filterRealEstates=t,window.filter.activationForm(),o()},a=function(e){const t=document.createElement("DIV");t.classList.add("error");const o=document.createElement("P");o.classList.add("error__message"),o.textContent=e,t.appendChild(o),t.setAttribute("tabindex","0"),t.focus(),document.querySelector("main").appendChild(t),t.addEventListener("click",(function(){document.querySelector("main").removeChild(document.querySelector("main").lastChild)})),t.addEventListener("keydown",(function(e){"Escape"===e.key&&document.querySelector("main").removeChild(document.querySelector("main").lastChild)}))},d=function(){e.classList.remove("map--faded"),window.form.adForm.classList.remove("ad-form--disabled");for(let e=0;e<window.form.adForm.children.length;e++)window.form.adForm.children[e].removeAttribute("disabled");window.load.loadData(r,a,"GET",window.data.URL_DOWNLOAD)},i=function(e){0===e.button&&(d(),t.removeEventListener("mousedown",i),t.removeEventListener("keydown",c))},c=function(e){"Enter"===e.key&&(d(),t.removeEventListener("mousedown",i),t.removeEventListener("keydown",c))};t.addEventListener("keydown",c),t.addEventListener("mousedown",i);const s=function(){e.classList.add("map--faded"),window.form.adForm.reset(),window.form.adForm.classList.add("ad-form--disabled");for(let e=0;e<window.form.adForm.children.length;e++)window.form.adForm.children[e].setAttribute("disabled","disabled");for(let e=0;e<window.filter.formFilters.children.length;e++)window.filter.formFilters.children[e].setAttribute("disabled","disabled");window.form.adForm.querySelector("#address").setAttribute("value",window.data.LEFT_MAP_PIN+", "+window.data.TOP_MAP_PIN),t.style.left=window.data.LEFT_MAP_PIN-window.data.HALF_WIDTH_MAIN_PIN+"px",t.style.top=window.data.TOP_MAP_PIN-window.data.HALF_HEIGHT_MAIN_PIN+"px",e.querySelector(".map__card")&&e.removeChild(e.querySelector(".map__card")),n(),t.addEventListener("keydown",c),t.addEventListener("mousedown",i)};s(),e.addEventListener("click",(function(t){let o=t.target;if("IMG"===o.tagName&&(o=o.parentNode),o.classList.contains("map__pin")&&!o.classList.contains("map__pin--main")){const t=document.querySelector(".map__pins .map__pin--active");t&&t.classList.remove("map__pin--active"),o.classList.add("map__pin--active"),e.querySelector(".map__card")&&e.removeChild(e.querySelector(".map__card")),e.insertBefore(window.card.renderCard(window.data.filterRealEstates[o.dataset.index]),e.children[1])}})),e.addEventListener("keydown",(function(t){e.querySelector(".map__card")&&"Escape"===t.key&&e.querySelector(".map__card").classList.add("hidden")})),window.map={mapAdverts:e,mapPin:t,deactivationPage:s,removePins:n,renderPinsJSON:o}})(),(()=>{const e=function(e,t){let o=e.offsetLeft+window.data.HALF_WIDTH_MAIN_PIN,n=e.offsetTop+window.data.HALF_HEIGHT_MAIN_PIN;return t&&(n=e.offsetTop+window.data.HEIGHT_PIN_MAIN),`${o}, ${n}`};window.map.mapPin.addEventListener("mousedown",(function(t){t.preventDefault();let o={x:t.clientX,y:t.clientY},n=!1;const r=function(t){n=!0,t.preventDefault();let r=o.x-t.clientX,a=o.y-t.clientY;o={x:t.clientX,y:t.clientY};const d=Number(window.map.mapPin.offsetLeft-r),i=Number(window.map.mapPin.offsetTop-a),c=0-window.data.HALF_WIDTH_MAIN_PIN,s=document.querySelector(".map").clientWidth-window.data.HALF_WIDTH_MAIN_PIN,l=window.data.MIN_MAP_Y-window.data.HEIGHT_PIN_MAIN,u=window.data.MAX_MAP_Y-window.data.HEIGHT_PIN_MAIN;d>=c&&d<=s&&(window.map.mapPin.style.left=window.map.mapPin.offsetLeft-r+"px"),i>=l&&i<=u&&(window.map.mapPin.style.top=window.map.mapPin.offsetTop-a+"px"),window.form.adForm.querySelector("#address").setAttribute("value",e(window.map.mapPin,n))},a=function(t){t.preventDefault(),window.form.adForm.querySelector("#address").setAttribute("value",e(window.map.mapPin,n)),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",a)};document.addEventListener("mousemove",r),document.addEventListener("mouseup",a)}))})()})();