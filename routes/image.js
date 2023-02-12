const express = require('express');
const multer = require('multer');
const router = express.Router()
const imageController = require('../controller/controller.image')


const imageUpload = multer({
    dest: 'images',
  }); 

router.post('/:id',imageUpload.single('image'), imageController.uploadImg)
router.put('/', imageController.loadImg)


module.exports = router