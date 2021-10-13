const OrderModel = require('../models').OrderModel;
const {ObjectId} = require('mongodb');

module.exports = class OrderService {

    attributes;

    constructor() {
        this.attributes = ['_id', 'customer_id', 'sub_total', 'shipping_charge', 'tax_percentage', 'tax_amount', 'coupon_applied', 'coupon_code', 'coupon_discount_percent', 'coupon_discount_amount', 'grand_total', 'status', 'created_at','updated_at', 'deleted_at', 'address', 'products', 'customer_details', 'payment'];
    }

    async get(searchTxt) {
        try {
            if (!searchTxt) {
                let result = await OrderModel.find(
                    { status: { $ne: 'DELETED' } },
                    // ['_id', 'department_id', 'category_id', 'product_title', 'product_slug', 'attributes', 'reviews', 'images', 'status', 'created_at', 'updated_at', 'deleted_at'],
                    this.attributes,
                    { sort: { created_at: -1 } });
                return result;
            } else {
                let result = await OrderModel.find(
                    { $and: [{ $or: [{ title: new RegExp(searchTxt, 'i') }], status: { $ne: 'DELETED' } }] },
                    // ['_id', 'department_id', 'category_id', 'product_title', 'product_slug', 'attributes', 'reviews', 'images', 'status', 'created_at', 'updated_at', 'deleted_at'],
                    this.attributes,
                    {
                        sort: { created_at: -1 }
                    });
                return result;
            }
        } catch (ex) {
            throw ex;
        }
    }

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

    async updateStatus(in_id, in_data) {
        try {
            let id = ObjectId(in_id);
            let result = await OrderModel.updateOne({ _id: id }, in_data);
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