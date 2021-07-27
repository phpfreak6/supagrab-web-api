const Validator = require('validatorjs');
const {ObjectId} = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const WishlistService = require('../services').WishlistService;
const WishlistServiceObj = new WishlistService();

module.exports = class WishlistController {

    constructor() {

    }

    async getWishlistItems(req, res, next) {
        try {

            let user_id = null;
            if( req.hasOwnProperty('authData') && req.authData.id ) {
                user_id = ObjectId(req.authData.id);

            } else if( req.params.user_id ) {
                user_id = ObjectId(req.params.user_id);

            } else {
                user_id = null;
                throw 'User id is not defined';
            }
            let wishlistItemsObj = await WishlistServiceObj.getWishlistItems(user_id);
            return await responseServiceObj.sendResponse(res, {
                msg: 'Wishlist Items Fetched Successfully',
                data: {
                    wishlist_items: wishlistItemsObj
                }
            });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    async insertWishlistItem(req, res, next) {
        try {
            
            let user_id = null;
            if( req.hasOwnProperty('authData') && req.authData.id ) {
                user_id = ObjectId(req.authData.id);

            } else if( req.params.user_id ) {
                user_id = ObjectId(req.params.user_id);

            } else {
                user_id = null;
                throw 'User id is not defined';
            }
            let dataObj = req.body;
            let rules = {product_id: 'required|string'};
            let validation = new Validator(dataObj, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            WishlistServiceObj.checkWishlistItemExists(user_id, dataObj.product_id)
                    .then(async (isExists) => {
                        if (isExists) {
                            throw 'Product already exists in wishlist';
                        }
                        return true;
                    })
                    .then(async (inResult) => {
                        let result = await WishlistServiceObj.insertWishlistItem(user_id, dataObj);
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Item Added To Wishlist',
                            data: {
                                wishlist_items: result
                            }
                        });
                    })
                    .catch(async (ex) => {
                        return await responseServiceObj.sendException(res, {
                            msg: ex.toString()
                        });
                    });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    async deleteWishlistItem(req, res, next) {
        try {
            
            let user_id = null;
            if( req.hasOwnProperty('authData') && req.authData.id ) {
                user_id = ObjectId(req.authData.id);

            } else if( req.params.user_id ) {
                user_id = ObjectId(req.params.user_id);

            } else {
                user_id = null;
                throw 'User id is not defined';
            }
            let wishlist_item_id = ObjectId(req.params.wishlist_item_id);
            let result = await WishlistServiceObj.deleteWishlistItem(user_id, wishlist_item_id);
            return await responseServiceObj.sendResponse(res, {
                msg: 'Wishlist Item Deleted Successfully',
                data: {
                    wishlist_items: result
                }
            });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }
};