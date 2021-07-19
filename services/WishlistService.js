const UserModel = require('../models').UserModel;
const {ObjectId} = require('mongodb');

module.exports = class WishlistService {

    constructor() {

    }

    async getWishlistItems(in_user_id) {
        try {
            let user_id = ObjectId(in_user_id);
            let result = await UserModel.findById(user_id);
            return result.wishlist;
        } catch (ex) {
            throw ex;
        }
    }

    async checkWishlistItemExists(user_id, in_product_id) {
        try {
            let product_id = ObjectId(in_product_id);
            let result = await UserModel.findOne({_id: user_id, "wishlist.product_id": product_id});
            if (result) {
                return true;
            }
            return false;
        } catch (ex) {
            throw ex;
        }
    }

    async insertWishlistItem(in_user_id, dataObj) {
        try {
            let product_id = ObjectId(dataObj.product_id);
            let user_id = ObjectId(in_user_id);
            let result = await UserModel.findOneAndUpdate(
                    {_id: user_id}, {$push: {
                    wishlist: {
                        _id: new ObjectId(),
                        user_id: user_id,
                        product_id: product_id,
                        product_detail: dataObj.product_detail
                    }
                }
            }, {new : true}
            );
            return result.wishlist;
        } catch (ex) {
            throw ex;
        }
    }

    async deleteWishlistItem(in_user_id, in_wishlist_item_id) {
        try {
            let user_id = ObjectId(in_user_id);
            let wishlist_item_id = ObjectId(in_wishlist_item_id);
            let result = await UserModel.findOneAndUpdate({_id: user_id}, {$pull: {wishlist: {_id: wishlist_item_id}}}, {new : true});
            return result.wishlist;
        } catch (ex) {
            throw ex;
        }
    }
};