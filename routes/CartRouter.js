const express = require('express');
const router = express.Router({
    mergeParams: true
});

const CartController = new require('../controllers').CartController;
const CartControllerObj = new CartController();

/**
 * CART ROUTING STARTS
 */

// router.patch('/:user_id/cart/:id', [
//     CartControllerObj.updateCart
// ]);

router.patch('/:user_id/cart/:id/update-quantity', [
    CartControllerObj.updateCart
]);

router.delete('/:user_id/cart/clear-cart', [
    CartControllerObj.clearCartByUser
]);

router.delete('/:user_id/cart/:id', [
    CartControllerObj.deleteCart
]);

// router.get('/:user_id/cart/:id', [
//     CartControllerObj.getCartById
// ]);

router.post('/:user_id/product/:product_id/cart', [
    CartControllerObj.insertCart
]);

router.get('/:user_id/cart/', [
    CartControllerObj.getCartByUser
]);

/**
 * CART ROUTING ENDS
 */

module.exports = router;