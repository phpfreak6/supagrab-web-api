const express = require('express');
const router = express.Router();

const SiteSettingController = new require('../controllers').SiteSettingController;
const SiteSettingControllerObj = new SiteSettingController();

router.get('/', [SiteSettingControllerObj.getSiteSettings]);
router.patch('/:site_setting_key', [SiteSettingControllerObj.updateSiteSetting]);

module.exports = router;