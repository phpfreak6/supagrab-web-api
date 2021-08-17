const express = require('express');
const router = express.Router({
    mergeParams: true
});

const DepartmentController = new require('../controllers').DepartmentController;
const DepartmentControllerObj = new DepartmentController();

let DEPARTMENT_IMAGE_UPLOAD_PATH = require('../config/config').DEPARTMENT_IMAGE_UPLOAD_PATH;
/**
 * IMAGE UPLOAD STARTS
 */
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DEPARTMENT_IMAGE_UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        let id = req.params.id;
        let originalname = file.originalname;
        let newFileName = id;
        let extention = path.extname(originalname);
        let fullFileName = newFileName + extention;
        let fullFileNameWithPath = DEPARTMENT_IMAGE_UPLOAD_PATH + '/' + fullFileName;
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

router.get('/slug-exists/:department_slug/:id?', [DepartmentControllerObj.slugExists]);
router.get('/exists/:title/:id?', [DepartmentControllerObj.exists]);
router.get('/', [DepartmentControllerObj.get]);
router.get('/:id', [DepartmentControllerObj.getById]);
router.post('/', [DepartmentControllerObj.insert]);
router.patch('/:id', [DepartmentControllerObj.update]);
router.delete('/:id', [DepartmentControllerObj.delete]);
router.delete('/:id/delete-image/:image', [DepartmentControllerObj.deleteImage]);
router.post('/:id/image', cpUpload, [DepartmentControllerObj.uploadImage]);

module.exports = router;