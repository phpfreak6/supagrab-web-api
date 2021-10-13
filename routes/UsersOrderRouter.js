const express = require('express');
const router = express.Router({
  mergeParams: true
});

const OrderController = new require('../controllers').OrderController;
const OrderControllerObj = new OrderController();

/**
 * USER-ORDER ROUTING STARTS HERE
 */
router.patch('/:user_id/order/:order_id/status', [
    OrderControllerObj.paymentFailed
]);

router.patch('/:user_id/order', [
    OrderControllerObj.update
]);

router.get('/:user_id/order/:order_id', [
    OrderControllerObj.getById
]);

router.get('/:user_id/order', [
    OrderControllerObj.getByUser
]);

router.post('/:user_id/order', [
    OrderControllerObj.insert
]);
/**
 * USER-ORDER ROUTING ENDS HERE
 */
module.exports = router;