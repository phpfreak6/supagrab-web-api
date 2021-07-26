const express = require('express');
const router = express.Router();

const ContactUsController = new require('../controllers').ContactUsController;
const ContactUsControllerObj = new ContactUsController();


router.post('/contact-us', [ContactUsControllerObj.contact]);

module.exports = router;