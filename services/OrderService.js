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

    async update( order_id, in_data ) {
        try {

            let result = await OrderModel.findOneAndUpdate({ _id: order_id }, {"payment": in_data}, { new: true });
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}