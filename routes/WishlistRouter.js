const express = require('express');
const router = express.Router({
    mergeParams: true
});

const WishlistController = new require('../controllers').WishlistController;
const WishlistControllerObj = new WishlistController();

router.get('/:user_id/wishlists', [WishlistControllerObj.getWishlistItems]);
router.post('/:user_id/wishlists', [WishlistControllerObj.insertWishlistItem]);
router.delete('/:user_id/wishlists/:wishlist_item_id', [WishlistControllerObj.deleteWishlistItem]);

module.exports = router;