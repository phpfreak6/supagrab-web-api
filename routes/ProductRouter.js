const express = require('express');
const router = express.Router();

const ProductController = require('../controllers').ProductController;
const ProductControllerObj = new ProductController();

var ImagePath = require('../config/config').ImageUploadPath;
/**
 * IMAGE UPLOAD STARTS
 */
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ImagePath)
  },
  filename: function (req, file, cb) {
    let id = req.params.id;
    let originalname = file.originalname;
    let newFileName = id;
    let extention = path.extname(originalname);
    let fullFileName = newFileName + extention;
    let fullFileNameWithPath = ImagePath + '/' + fullFileName;
    req.params.imageDetails = {
      fileOriginalname: originalname,
      newFileName: newFileName,
      fileExtention: extention,
      fullFileName: fullFileName,
      fullFileNameWithPath: fullFileNameWithPath
    };
    cb(null, fullFileName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 } // (1000000 bytes = 1MB)
});

var cpUpload = upload.fields([
  { name: 'profile_pic', maxCount: 1 }
]);
/**
 * IMAGE UPLOAD ENDS
 */

/**
 *  ROUTING STARTS
 */

// router.delete('/:id/deletePic/:profilePic', [
//   ProductControllerObj.deleteProfilePic
// ]);

// router.patch('/setStatus/:id', [
//   ProductControllerObj.setStatus
// ]);

// router.post('/changePic/:id', cpUpload, [
//   ProductControllerObj.changeProfilePic
// ]);

router.get('/byDepartment/:department_slug', [
  ProductControllerObj.productByDepartment
]);

router.get('/byCategory/:category_slug', [
  ProductControllerObj.productByCategory
]);

router.get('/product-slug-exists', [
    ProductControllerObj.slugExists
]);

router.get('/product-exists', [
    ProductControllerObj.exists
]);

router.patch('/:id', [
  ProductControllerObj.update
]);

router.delete('/:id', [
  ProductControllerObj.delete
]);

router.get('/:id', [
  ProductControllerObj.getById
]);

router.post('/', [
  ProductControllerObj.insert
]);

router.get('/', [
  ProductControllerObj.get
]);

/**
 *  ROUTING ENDS
 */

module.exports = router;