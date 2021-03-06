import async from "async"
import mkdirp from "mkdirp"
import multer from "multer"
import path from "path"
import uuid from "node-uuid"

let debug = require("debug")("Modules:photo-inventory")
import { pick } from "underscore"

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: File upload only supports the following filetypes - " + filetypes);
}

const fetchFileInfo = (file, album_id) => {
  const {originalname, destination, filename, size, fieldname} = file

  return {
    id: uuid.v4().replace(/\-/g, ''),
    originalname,
    destination,
    filename,
    size,
    album_id
  }
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min)) + min
}

const controller = ({modules}) => {
  const {logger, queryDb, redisClient} = modules;
  debug(`photoInventoryController controller`);

  const destination = (req, file, cb) => {
    const { body } = req
    async.waterfall(
      [
        (done) => mkdirp(`./uploads/${body.order_id}`, (err) => done(err)),
        (done) => cb(null, `./uploads/${body.order_id}`)
      ]
    )
  }

  const filename = (req, file, cb) => {
    const { fieldname, originalname } = file

    cb(null, `${fieldname}-${Date.now()}`)
  }

  const storage = multer.diskStorage({
    destination,
    filename
  })

  const upload = multer({storage}).fields([{name: 'images', maxCount: 10}])

  return {
    main: ({attributes, responders, page}) => {
      const {req, res} = attributes
      const { session } = req

      upload(req, res, (err) => {
        const { order_id, album_id } = req.body

        if (err) {
          logger.error(err);
          return res.status(500).end();
        }

        const images = req.files['images'] || []
        images.map(image => {
          const fileInfo = fetchFileInfo(image, album_id)
          let score = parseInt(fileInfo.originalname.replace(/[^\d]/g, ''))
          score = isNaN(score) ? getRandomInt(0, 1000) : score

          redisClient.zadd([`order_id_${order_id}:files`, score, JSON.stringify(fileInfo)])
        })


        res.status(200).end()
      });
    }
  }
}

export default controller;
