const express = require('express');
const router = express.Router();

const DepartmentController = new require('../controllers').DepartmentController;
const DepartmentControllerObj = new DepartmentController();

let DEPARTMENT_IMAGE_PATH = require('../config/config').DEPARTMENT_IMAGE_PATH;
/**
 * IMAGE UPLOAD STARTS
 */
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, userImagePath)
    },
    filename: function (req, file, cb) {
        let id = req.params.id;
        let originalname = file.originalname;
        let newFileName = id;
        let extention = path.extname(originalname);
        let fullFileName = newFileName + extention;
        let fullFileNameWithPath = userImagePath + '/' + fullFileName;
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

const upload = multer({storage: storage, limits: {fileSize: 1000000}});
let cpUpload = upload.fields([{name: 'profile_pic', maxCount: 1}]);

router.get('/exists/:title/:id?', [DepartmentControllerObj.exists]);
router.get('/', [DepartmentControllerObj.get]);
router.get('/:id', [DepartmentControllerObj.getById]);
router.post('/', [DepartmentControllerObj.insert]);
router.patch('/:id', [DepartmentControllerObj.update]);
router.delete('/:id', [DepartmentControllerObj.delete]);
router.post('image/:id', cpUpload, [DepartmentControllerObj.uploadImage]);

module.exports = router;