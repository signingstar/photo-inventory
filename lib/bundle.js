require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _multer = __webpack_require__(1);
	
	var _multer2 = _interopRequireDefault(_multer);
	
	var _underscore = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var debug = __webpack_require__(3)("Modules:photo-inventory");
	
	
	var photoInventoryController = function photoInventoryController(_ref) {
	  var modules = _ref.modules;
	  var pug = modules.pug;
	  var logger = modules.logger;
	  var jsAsset = modules.jsAsset;
	  var cssAsset = modules.cssAsset;
	
	  debug("photoInventoryController controller");
	  var upload = (0, _multer2.default)({ dest: './uploads/' }).fields([{ name: 'photo', maxCount: 1 }]);
	
	  return {
	    main: function main(_ref2) {
	      var attributes = _ref2.attributes;
	      var responders = _ref2.responders;
	      var page = _ref2.page;
	      var req = attributes.req;
	      var res = attributes.res;
	
	
	      upload(req, res, function (err) {
	        if (err) {
	          console.log(err);
	
	          res.end('something wrong');
	        }
	
	        var _pick = (0, _underscore.pick)(req.body, function (value, key) {
	          return key === 'category' || key === 'size';
	        });
	
	        var category = _pick.category;
	        var size = _pick.size;
	
	
	        console.log("req:" + req.body + " | body:" + JSON.stringify(req.body));
	        console.log(req.body);
	        console.log(req.files);
	
	        res.end("category:" + category + " | size:" + size);
	        // res.end('all is well');
	      });
	    }
	  };
	};
	
	module.exports = photoInventoryController;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("multer");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("underscore");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("debug");

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map