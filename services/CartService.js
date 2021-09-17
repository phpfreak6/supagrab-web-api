const CartModel = require('../models').CartModel;
const {ObjectId} = require('mongodb');

module.exports = class FaqService {

    constructor() {}

    async getCartByUser(userId) {
        try {

            let result = await CartModel.find(
                {
                    user_id: userId
                }, // condition
                [
                    'user_id',
                    'product_id',
                    'product_detail',
                    'qty',

                    'status',

                    'deletedAt',
                    'createdAt',
                    'updatedAt'
                ], // Columns to Return
                {
                    sort: {
                        createdAt: -1 //Sort by Date Added DESC
                    }
                }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getCartById(in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await CartModel.findOne({_id: id, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {

            throw ex;
        }
    }

    async insertCart(in_data) {
        try {

            let result = await CartModel.create(in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async updateCart(in_data, in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await CartModel.updateOne({_id: id}, in_data, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async deleteCart(in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await CartModel.deleteOne({_id: id}, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async clearCartByUserId(in_user_id) {
        try {

            let user_id = ObjectId(in_user_id);
            let result = await CartModel.deleteMany({user_id: user_id}, {multi: true});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async isCartIdExists(cart_id) {
        try {

            let result = await CartModel.countDocuments({_id: cart_id});
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async isItemExistsInCart( userId, productId ) {
        try {

            let result = await CartModel.countDocuments({ 
                user_id: userId,
                product_id: productId
            });
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }
}