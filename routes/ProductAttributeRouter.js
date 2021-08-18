const express = require('express');
const router = express.Router({
    mergeParams: true
});

const { ObjectId } = require('mongodb');

const ProductAttributeController = require('../controllers').ProductAttributeController;
const ProductAttributeControllerObj = new ProductAttributeController();

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

// router.get('/:cms_key/exists/:cms_id?', [
//     ProductAttributeControllerObj.isExists
// ]);

router.patch('/:id', [
    ProductAttributeControllerObj.update
]);

router.delete('/:id', [
    ProductAttributeControllerObj.delete
]);

router.get('/:id', [
    ProductAttributeControllerObj.getById
]);

router.post('/', [
    ProductAttributeControllerObj.insert
]);

router.get('/', [
    ProductAttributeControllerObj.getAll
]);

/**
 *  ROUTING ENDS
 */

module.exports = router;