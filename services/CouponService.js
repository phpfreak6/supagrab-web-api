const CouponModel = require('../models').CouponModel;
const {ObjectId} = require('mongodb');

module.exports = class CouponService {

    attributes;

    constructor() {

        this.attributes = [
            'coupon_title',
            'coupon_code',
            'coupon_description',

            'coupon_max_uses',
            'coupon_uses_yet',

            'coupon_type',
            'discount_amount',

            'status',

            'deletedAt',
            'createdAt',
            'updatedAt',
        ];
    }

    async getAllCount(searchTxt) {
        try {

            if (!searchTxt) {

                let result = await CouponModel.count(
                    {
                        status: {$ne: 'DELETED'}
                    }, // condition
                );
                return result;
            } else {

                let result = await CouponModel.count({
                    $and: [
                        {

                            $or: [
                                {
                                    key: new RegExp(searchTxt, 'i')
                                },
                                {
                                    value: new RegExp(searchTxt, 'i')
                                }
                            ],
                            status: {$ne: 'DELETED'}
                        },
                    ],
                });
                return result;
            }
        } catch (ex) {
            throw ex;
        }
    }

    async getAll(searchTxt) {
        try {

            if (!searchTxt) {

                let result = await CouponModel.find(
                        {
                            status: {$ne: 'DELETED'}
                        }, // condition
                        this.attributes, // Columns to Return
                        {
                            sort: {
                                createdAt: -1 //Sort by Date Added DESC
                            }
                        });
                return result;
            } else {

                let result = await CouponModel.find({
                    $and: [
                        {

                            $or: [
                                {
                                    coupon_title: new RegExp(searchTxt, 'i')
                                },
                                {
                                    coupon_code: new RegExp(searchTxt, 'i')
                                },
                                {
                                    coupon_description: new RegExp(searchTxt, 'i')
                                }
                            ],
                            status: {$ne: 'DELETED'}
                        },
                    ],
                },
                        this.attributes, // Columns to Return,
                        {
                            sort: {
                                createdAt: -1 //Sort by Date Added DESC
                            }
                        });
                return result;
            }
        } catch (ex) {
            throw ex;
        }
    }

    async getById(in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await CouponModel.findOne({_id: id, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {

            throw ex;
        }
    }

    async getByCode(in_coupon_code) {
        try {

            let result = await CouponModel.findOne({ coupon_code: in_coupon_code, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {

            throw ex;
        }
    }

    async insert(in_data) {
        try {

            let coupon_code = in_data.coupon_code;
            coupon_code = coupon_code.replace(/\s+/g, '-').toUpperCase();
            in_data.coupon_code = coupon_code;

            let result = await CouponModel.create(in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async update(in_data, in_id) {
        try {

            let id = ObjectId(in_id);
            
            if( in_data.coupon_code ) {
                let coupon_code = in_data.coupon_code;
                coupon_code = coupon_code.replace(/\s+/g, '-').toUpperCase();
                in_data.coupon_code = coupon_code;
            }

            let result = await CouponModel.updateOne({_id: id}, in_data, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async delete(in_data, id) {
        try {

            let id = ObjectId(id);
            let result = await CouponModel.updateOne({_id: id}, in_data, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async isIdExists(in_id) {
        try {

            let result = await CouponModel.countDocuments({_id: in_id});
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async isCodeExists(in_coupon_code, in_id = false) {
        try {
            if (in_id) {

                let result = await CouponModel.countDocuments({
                    coupon_code: in_coupon_code,
                    _id: {$ne: in_id}
                });
                let isExists = result > 0 ? true : false;
                return isExists;
            } else {

                let result = await CouponModel.countDocuments({coupon_code: in_coupon_code});
                let isExists = result > 0 ? true : false;
                return isExists;
            }
        } catch (ex) {
            throw ex;
        }
    }
}