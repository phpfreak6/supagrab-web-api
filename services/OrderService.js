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
}