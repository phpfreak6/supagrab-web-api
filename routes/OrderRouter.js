const express = require('express');
const router = express.Router({
    mergeParams: true
});

const OrderController = new require('../controllers').OrderController;
const OrderControllerObj = new OrderController();

/**
 * ORDER ROUTING STARTS
 */

router.patch('/:user_id/order/:order_id/status', [
    OrderControllerObj.paymentFailed
]);

router.patch('/:user_id/order', [
    OrderControllerObj.update
]);

// router.patch('/:user_id/cart/:id/update-quantity', [
//     OrderControllerObj.updateCart
// ]);

// router.delete('/:user_id/cart/clear-cart', [
//     OrderControllerObj.clearCartByUser
// ]);

// router.delete('/:user_id/cart/:id', [
//     OrderControllerObj.deleteCart
// ]);

// router.get('/:user_id/cart/:id', [
//     OrderControllerObj.getCartById
// ]);

router.post('/:user_id/order', [
    OrderControllerObj.insert
]);

// router.get('/:user_id/cart/', [
//     OrderControllerObj.getCartByUser
// ]);

/**
 * ORDER ROUTING ENDS
 */

module.exports = router;