"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _underscore = require("underscore");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require("debug")("Modules:photo-inventory");


var controller = function controller(_ref) {
  var modules = _ref.modules;
  var logger = modules.logger;
  var queryDb = modules.queryDb;

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
          logger.error(err);
          res.status(500).end();
        }

        var _pick = (0, _underscore.pick)(req.body, function (value, key) {
          return key === 'category' || key === 'size';
        });

        var category = _pick.category;
        var size = _pick.size;


        res.status(302).json({ successUrl: '/checkout?orderid=abc123' });
      });
    }
  };
};

exports.default = controller;