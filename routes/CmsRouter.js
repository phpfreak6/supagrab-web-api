const express = require('express');
const router = express.Router({
    mergeParams: true
});

const CmsController = new require('../controllers').CmsController;
const CmsControllerObj = new CmsController();

/**
 * Cms ROUTING STARTS
 */

router.get('/:cms_key/exists/:cms_id?', [
    CmsControllerObj.isCmsExists
]);

router.get('/key/:cms_key', [
    CmsControllerObj.getCmsByKey
]);

router.patch('/:id', [
    CmsControllerObj.updateCms
]);

router.delete('/:id', [
    CmsControllerObj.deleteCms
]);

router.get('/:id', [
    CmsControllerObj.getCmsById
]);

router.post('/', [
    CmsControllerObj.insertCms
]);

router.get('/', [
    CmsControllerObj.getAllCms
]);

/**
 * Cms ROUTING ENDS
 */

module.exports = router;