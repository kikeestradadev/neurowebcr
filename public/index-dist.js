/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _themeModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

var coreModule = function coreModule() {
  (0,_themeModule__WEBPACK_IMPORTED_MODULE_0__["default"])();
};
/* harmony default export */ __webpack_exports__["default"] = (coreModule);

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   themeInitScript: function() { return /* binding */ themeInitScript; }
/* harmony export */ });
var STORAGE_KEY = 'nw-theme';
var THEMES = ['light', 'dark'];
var getPreferredTheme = function getPreferredTheme() {
  if (typeof window === 'undefined') return 'light';
  var stored = localStorage.getItem(STORAGE_KEY);
  if (THEMES.includes(stored)) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
var getThemeToggles = function getThemeToggles() {
  return document.querySelectorAll('[data-theme-toggle]');
};
var applyTheme = function applyTheme(theme) {
  var next = THEMES.includes(theme) ? theme : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_KEY, next);
  var isDark = next === 'dark';
  getThemeToggles().forEach(function (toggle) {
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
    toggle.setAttribute('title', isDark ? 'Modo claro' : 'Modo oscuro');
  });
};
var withTransition = function withTransition(fn) {
  document.documentElement.classList.add('theme-transition');
  fn();
  window.setTimeout(function () {
    document.documentElement.classList.remove('theme-transition');
  }, 300);
};
var themeModule = function themeModule() {
  applyTheme(getPreferredTheme());
  var toggles = getThemeToggles();
  if (!toggles.length) return;
  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      withTransition(function () {
        return applyTheme(next);
      });
    });
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
    if (localStorage.getItem(STORAGE_KEY)) return;
    withTransition(function () {
      return applyTheme(event.matches ? 'dark' : 'light');
    });
  });
};

/** Para script inline en head (evitar flash de tema incorrecto) */
var themeInitScript = "!(function(){try{var t=localStorage.getItem('".concat(STORAGE_KEY, "');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})();");
/* harmony default export */ __webpack_exports__["default"] = (themeModule);

/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
var internalModule = function internalModule() {
  initPortfolioSwiper();
};
var portfolioSwiper = null;
var initPortfolioSwiper = function initPortfolioSwiper() {
  var group = document.querySelector('.portfolio-swiper-group');
  var el = group === null || group === void 0 ? void 0 : group.querySelector('.portfolio-swiper');
  var pagination = group === null || group === void 0 ? void 0 : group.querySelector('.portfolio-swiper__pagination');
  var prev = el === null || el === void 0 ? void 0 : el.querySelector('.swiper-button-prev');
  var next = el === null || el === void 0 ? void 0 : el.querySelector('.swiper-button-next');
  if (!el || !pagination || !prev || !next || typeof Swiper === 'undefined') return;
  portfolioSwiper = new Swiper(el, {
    slidesPerView: 'auto',
    spaceBetween: 24,
    loop: true,
    grabCursor: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: pagination,
      clickable: true
    },
    navigation: {
      nextEl: next,
      prevEl: prev
    }
  });
};
/* harmony default export */ __webpack_exports__["default"] = (internalModule);

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_modules_coreModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _internal_modules_internalModule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/*here start core layout ui scripts imports*/

/*here finish core layout ui scripts imports*/

/*here start internal layout ui components scripts imports*/

/*here finish internal layout ui components scripts imports*/

(function () {
  /*here start core layout ui scripts functions*/
  (0,_core_modules_coreModule__WEBPACK_IMPORTED_MODULE_0__["default"])();
  /*here finish core layout ui scripts functions*/
})();
(function () {
  /*here start internal layout ui components functions*/
  (0,_internal_modules_internalModule__WEBPACK_IMPORTED_MODULE_1__["default"])();
  /*here finish internal layout ui components functions*/
})();
}();
/******/ })()
;
//# sourceMappingURL=index-dist.js.map