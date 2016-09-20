import multer from "multer";
let debug = require("debug")("Modules:photo-inventory");
import { pick } from "underscore";

const controller = ({modules}) => {
  const {logger, queryDb} = modules;
  debug(`photoInventoryController controller`);
  const upload = multer({dest: './uploads/'}).fields([{name:'photo', maxCount:1}]);

  return {
    main: ({attributes, responders, page}) => {
      const {req, res} = attributes;

      upload(req, res, (err) => {
        if (err) {
          logger.error(err);
          res.status(500).end();
        }

        let {category, size} = pick(req.body, (value, key)=> {
          return key === 'category' || key === 'size';
        });

        res.status(302).json({successUrl: '/checkout?orderid=abc123'});
     });
    }
  }
}

export default controller;
