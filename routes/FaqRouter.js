const express = require('express');
const router = express.Router({
    mergeParams: true
});

const FaqController = new require('../controllers').FaqController;
const FaqControllerObj = new FaqController();

/**
 * FAQ ROUTING STARTS
 */

router.patch('/:id', [
    FaqControllerObj.updateFaq
]);

router.delete('/:id', [
    FaqControllerObj.deleteFaq
]);

router.get('/:id', [
    FaqControllerObj.getFaqById
]);

router.post('/', [
    FaqControllerObj.insertFaq
]);

router.get('/', [
    FaqControllerObj.getAllFaq
]);

/**
 * FAQ ROUTING ENDS
 */

module.exports = router;