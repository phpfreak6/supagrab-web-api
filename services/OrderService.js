const OrderModel = require('../models').OrderModel;
const {ObjectId} = require('mongodb');

module.exports = class OrderService {

    constructor() {}

    async insert(in_data) {
        try {

            let result = await OrderModel.create(in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async update( in_order_id, in_data ) {
        try {

            let order_id = ObjectId(in_order_id);
            let result = await OrderModel.findOneAndUpdate(
                { _id: order_id }, 
                { 
                    $set:{
                        "payment": in_data 
                    }
                }, 
                { new: true }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async paymentFailed(in_order_id, status) {
        try {

            let order_id = ObjectId(in_order_id);
            let result = await OrderModel.findOneAndUpdate(
                { _id: order_id }, 
                { 
                    $set:{
                        "payment.transaction_status": status
                    }
                }, 
                { new: true }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getById(in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await OrderModel.findOne({_id: id, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {

            throw ex;
        }
    }

    async getByUser(in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await OrderModel.find({customer_id: id, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {

            throw ex;
        }
    }
}