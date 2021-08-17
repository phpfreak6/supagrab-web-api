const express = require('express');
const router = express.Router({
    mergeParams: true
});

const NewsletterController = new require('../controllers').NewsletterController;
const NewsletterControllerObj = new NewsletterController();

router.post('/subscribe', [NewsletterControllerObj.subscribe]);
router.get('/verify/:encrypted_string', [NewsletterControllerObj.verify]);

module.exports = router;