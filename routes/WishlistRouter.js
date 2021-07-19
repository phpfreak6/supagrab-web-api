const express = require('express');
const router = express.Router();

const WishlistController = new require('../controllers').WishlistController;
const WishlistControllerObj = new WishlistController();


console.log('we are here');

router.get('/:user_id/wishlists', [WishlistControllerObj.getWishlistItems]);

//router.post('/:user_id/addresses', [UserAddressControllerObj.insertUserAddress]);
//
//router.delete('/:user_id/addresses/:address_id', [UserAddressControllerObj.deleteUserAddress]);
//
//router.get('/:user_id/addresses/:address_id', [UserAddressControllerObj.getUserAddressByAddressId]);
//
//router.patch('/:user_id/addresses/:address_id', [UserAddressControllerObj.updateUserAddress]);

module.exports = router;