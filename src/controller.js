import multer from "multer";
let debug = require("debug")("Modules:photo-inventory");
import { pick } from "underscore";

const controller = ({modules}) => {
  let {pug, logger, jsAsset, cssAsset} = modules;
  debug(`photoInventoryController controller`);
  var upload = multer({dest: './uploads/'}).fields([{name:'photo', maxCount:1}]);

  return {
    main: ({attributes, responders, page}) => {
      let {req, res} = attributes;

      upload(req, res, err => {
       if (err) {
        console.log(err);
      }
      let {category, size} = pick(req.body, (value, key)=> {
        return key === 'category' || key === 'size';
      });

      res.status(200).json({successUrl: '/checkout?orderid=abc123'});
     });
    }
  }
}

export default controller;
