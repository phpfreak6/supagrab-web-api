const express = require('express');
const router = express.Router({
    mergeParams: true
});

const CouponController = new require('../controllers').CouponController;
const CouponControllerObj = new CouponController();

/**
 * COUPON ROUTING STARTS
 */

router.get('/code/:code', [
    CouponControllerObj.getByCode
]);

router.get('/code/:code/exists', [
    CouponControllerObj.isCodeExists
]);

router.get('/:id/exists', [
    CouponControllerObj.isExists
]);

router.patch('/:id/setStatus', [
    CouponControllerObj.setStatus
]);

router.patch('/:id', [
    CouponControllerObj.update
]);

router.delete('/:id', [
    CouponControllerObj.delete
]);

router.get('/:id', [
    CouponControllerObj.getById
]);

router.post('/', [
    CouponControllerObj.insert
]);

router.get('/', [
    CouponControllerObj.getAll
]);

/**
 * COUPON ROUTING ENDS
 */

module.exports = router;