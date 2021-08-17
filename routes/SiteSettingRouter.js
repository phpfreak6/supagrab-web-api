const express = require('express');
const router = express.Router({
    mergeParams: true
});

const SiteSettingController = new require('../controllers').SiteSettingController;
const SiteSettingControllerObj = new SiteSettingController();

router.get('/', [SiteSettingControllerObj.getSiteSettings]);
router.get('/:site_setting_key', [SiteSettingControllerObj.getSiteSettingByKey]);
router.patch('/:site_setting_key', [SiteSettingControllerObj.updateSiteSetting]);

module.exports = router;