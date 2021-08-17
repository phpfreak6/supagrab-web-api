const express = require('express');
const router = express.Router({
    mergeParams: true
});

const { ObjectId } = require('mongodb');

const ProductReviewController = require('../controllers').ProductReviewController;
const ProductReviewControllerObj = new ProductReviewController();

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

// router.patch('/setStatus/:id', [
// 	ProductReviewControllerObj.setStatus
// ]);

// router.get('/product-exists', [
// 	ProductReviewControllerObj.exists
// ]);

// router.patch('/:productId/review/:id', [
// 	ProductReviewControllerObj.update
// ]);

router.delete('/', [
	ProductReviewControllerObj.delete
]);

// router.get('/:id', [
// 	ProductReviewControllerObj.getById
// ]);

router.post('/', [
	ProductReviewControllerObj.insert
]);

// router.get('/', [
// 	ProductReviewControllerObj.getById
// ]);

router.get('/', [
	ProductReviewControllerObj.getByUser
]);

/**
 *  ROUTING ENDS
 */

module.exports = router;