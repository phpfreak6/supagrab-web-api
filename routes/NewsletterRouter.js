const express = require('express');
const router = express.Router();

const NewsletterController = new require('../controllers').NewsletterController;
const NewsletterControllerObj = new NewsletterController();

router.post('/newsletter/subscribe', [NewsletterControllerObj.subscribe]);

module.exports = router;