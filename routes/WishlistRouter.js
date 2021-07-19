const express = require('express');
const router = express.Router();

const WishlistController = new require('../controllers').WishlistController;
const WishlistControllerObj = new WishlistController();

router.get('/:user_id/wishlists', [WishlistControllerObj.getWishlistItems]);
router.post('/:user_id/wishlists', [WishlistControllerObj.insertWishlistItem]);

module.exports = router;