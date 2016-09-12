let multer = require("multer");
let debug = require("debug")("photo-inventory");

module.exports = controller = function({modules}) {
  let {pug, logger, jsAsset, cssAsset} = modules;
  debug(`photoInventoryController controller`);
  var upload = multer({dest: './uploads/'}).any();

  return {
    main: function({attributes, responders, page}) {
      let {req, res} = attributes;

      upload(req, res, function (err) {
         if (err) {
           console.log(err);

           res.end('something wrong');
         }
         console.log(req.body);
         console.log(req.files);

         res.end('all is well');
         // Everything went fine
       });
    }
  }
}
