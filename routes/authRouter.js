const express = require('express');
const router = express.Router();

const AuthController = require('../controllers').AuthController;
const AuthControllerObj = new AuthController();

const UserController = require('../controllers').UserController;
const UserControllerObj = new UserController();

var userImagePath = require('../config/config').userImageUploadPath;

/**
 * IMAGE UPLOAD STARTS
 */
 const path = require('path');
 const multer  = require('multer');
 
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
        let fullFileNameWithPath = userImagePath +'/'+ fullFileName;
        req.params.imageDetails = {
        fileOriginalname : originalname,
        newFileName : newFileName,
        fileExtention : extention,
        fullFileName : fullFileName,
        fullFileNameWithPath : fullFileNameWithPath
        };
        cb(null , fullFileName );
    }
 });
 
 const upload = multer({
   storage: storage,
   limits : {fileSize : 1000000} // (1000000 bytes = 1MB)
 });
 /**
  * IMAGE UPLOAD ENDS
  */

router.post('/signUp', upload.single('profile_pic'), [
    UserControllerObj.insertUser
]);

router.post('/signIn', upload.single('profile_pic'), [
  AuthControllerObj.signIn
]);

router.post('/signOut', [
  AuthControllerObj.signOut
]);

module.exports = router;