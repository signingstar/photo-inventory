"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _nodeUuid = require("node-uuid");

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _underscore = require("underscore");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require("debug")("Modules:photo-inventory");


var fileFilter = function fileFilter(req, file, cb) {
  var filetypes = /jpeg|jpg/;
  var mimetype = filetypes.test(file.mimetype);
  var extname = filetypes.test(_path2.default.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: File upload only supports the following filetypes - " + filetypes);
};

var fetchFileInfo = function fetchFileInfo(file) {
  var fileMetaData = {
    id: _nodeUuid2.default.v4().replace(/\-/g, ''),
    originalname: file.originalname,
    path: file.path
  };

  return fileMetaData;
};

var getRandomInt = function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
};

var getFileExtension = function getFileExtension(fileName) {
  var nameParts = fileName.split('.');

  if (nameParts.length >= 2) {
    var probableExtension = nameParts[nameParts.length - 1];

    if (probableExtension !== '') {
      return probableExtension;
    }
  }

  return 'jpg';
};

var controller = function controller(_ref) {
  var modules = _ref.modules;
  var logger = modules.logger;
  var queryDb = modules.queryDb;
  var redisClient = modules.redisClient;

  debug("photoInventoryController controller");

  var destination = function destination(req, file, cb) {
    var body = req.body;

    _async2.default.waterfall([function (done) {
      return (0, _mkdirp2.default)("./uploads/" + body.order_id, function (err) {
        return done(err);
      });
    }, function (done) {
      return cb(null, "./uploads/" + body.order_id);
    }]);
  };

  var filename = function filename(req, file, cb) {
    var fieldname = file.fieldname;
    var originalname = file.originalname;

    var ext = getFileExtension(originalname);

    cb(null, fieldname + "-" + Date.now() + "." + ext);
  };

  var storage = _multer2.default.diskStorage({
    destination: destination,
    filename: filename
  });

  var upload = (0, _multer2.default)({ storage: storage }).fields([{ name: 'images', maxCount: 10 }]);

  return {
    main: function main(_ref2) {
      var attributes = _ref2.attributes;
      var responders = _ref2.responders;
      var page = _ref2.page;
      var req = attributes.req;
      var res = attributes.res;
      var session = req.session;


      upload(req, res, function (err) {
        var orderId = req.body.order_id;

        if (err) {
          logger.error(err);
          return res.status(500).end();
        }

        var images = req.files['images'] || [];
        images.map(function (image) {
          var fileInfo = fetchFileInfo(image);
          var score = parseInt(fileInfo.originalname.replace(/[^\d]/g, ''));
          score = isNaN(score) ? getRandomInt(0, 1000) : score;

          redisClient.zadd(["order_id_" + orderId + ":files", score, JSON.stringify(fileInfo)]);
        });

        res.status(200).end();
      });
    }
  };
};

exports.default = controller;
//# sourceMappingURL=controller.js.map