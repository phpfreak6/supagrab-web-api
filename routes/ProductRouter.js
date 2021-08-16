const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');

const ProductController = require('../controllers').ProductController;
const ProductControllerObj = new ProductController();

var ImagePath = require('../config/config').PRODUCT_IMAGE_UPLOAD_PATH;
/**
 * IMAGE UPLOAD STARTS
 */
const path = require('path');
const multer = require('multer');

let filesArr = [];
let cntr = 0;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, ImagePath)
	},
	filename: function (req, file, cb) {
		cntr++;
		let id = req.params.id;
		let originalname = file.originalname;
		// let newFileName = id;
		let newFileName = new ObjectId();
		let extention = path.extname(originalname);
		let fullFileName = newFileName +'-'+ cntr + extention;
		let fullFileNameWithPath = ImagePath + '/' + fullFileName;

		// req.params.imageDetails = {
		// 	fileOriginalname: originalname,
		// 	newFileName: newFileName,
		// 	fileExtention: extention,
		// 	fullFileName: fullFileName,
		// 	fullFileNameWithPath: fullFileNameWithPath
		// };
		
		filesArr.push({
			fileOriginalname: originalname,
			newFileName: newFileName,
			fileExtention: extention,
			fullFileName: fullFileName,
			fullFileNameWithPath: fullFileNameWithPath
		});

		req.params.imageDetails = filesArr;
		cb(null, fullFileName);
	}
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 } // (1000000 bytes = 1MB)
});

// var cpUpload = upload.fields([
// 	{ name: 'profile_pic', maxCount: 1 }
// ]);

var arrUpload = upload.array( 'profile_pic', 1 );

/**
 * IMAGE UPLOAD ENDS
 */

/**
 *  ROUTING STARTS
 */

// router.delete('/:id/deletePic/:profilePic', [
//   ProductControllerObj.deleteProfilePic
// ]);

router.patch('/setStatus/:id', [
	ProductControllerObj.setStatus
]);

router.post('/upload-images/:id', arrUpload, [
  ProductControllerObj.uploadImage
]);

// router.delete('/delete-uploaded-image/:productId/:imageId', arrUpload, [
// 	ProductControllerObj.deleteImage
// ]);

router.patch('/set-image-primary/:productId/:imageId', [
	ProductControllerObj.setImagePrimary
]);

router.patch('/delete-uploaded-image/:productId/:image', arrUpload, [
	ProductControllerObj.deleteImage
]);

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