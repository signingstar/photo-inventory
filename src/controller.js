import multer from "multer";

const controller = function({modules}) {
  let {pug, logger, jsAsset, cssAsset} = modules;

  return {
    main: function({attributes, responders, page}) {
      let {req, res} = attributes;

      console.log(req.body);
      console.log(req.files);

      let config =  {
        dest: './uploads/',
        rename: function(fieldname, filename) {
          console.log(`fieldname:${fieldname} | filename:${filename}`);
          return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
        }
      }

      return multer(config).any();
    }
  }
}

export default controller;
