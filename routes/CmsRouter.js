const express = require('express');
const router = express.Router();

const CmsController = new require('../controllers').CmsController;
const CmsControllerObj = new CmsController();

/**
 * Cms ROUTING STARTS
 */

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