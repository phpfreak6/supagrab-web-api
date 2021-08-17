const express = require('express');
const router = express.Router({
    mergeParams: true
});

const CategoryController = new require('../controllers').CategoryController;
const CategoryControllerObj = new CategoryController();

let CATEGORY_IMAGE_UPLOAD_PATH = require('../config/config').CATEGORY_IMAGE_UPLOAD_PATH;
/**
 * IMAGE UPLOAD STARTS
 */
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, CATEGORY_IMAGE_UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        let id = req.params.id;
        let originalname = file.originalname;
        let newFileName = id;
        let extention = path.extname(originalname);
        let fullFileName = newFileName + extention;
        let fullFileNameWithPath = CATEGORY_IMAGE_UPLOAD_PATH + '/' + fullFileName;
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

const upload = multer({storage: storage, limits: {fileSize: 1000000 * 10}});
let cpUpload = upload.fields([{name: 'image', maxCount: 1}]);

router.get('/:department_id/categories/slugExists', [CategoryControllerObj.slugExists]);
router.get('/:department_id/categories/exists/:title/:id?', [CategoryControllerObj.exists]);
router.get('/:department_id/categories', [CategoryControllerObj.get]);
router.post('/:department_id/categories', [CategoryControllerObj.insert]);
router.get('/:department_id/categories/:id', [CategoryControllerObj.getById]);
router.patch('/:department_id/categories/:id', [CategoryControllerObj.update]);
router.delete('/:department_id/categories/:id', [CategoryControllerObj.delete]);

//router.delete(':department_id/categories/:id/delete-image/:image', [CategoryControllerObj.deleteImage]);
//router.post(':department_id/categories/:id/image', cpUpload, [CategoryControllerObj.uploadImage]);

module.exports = router;