const ProductModel = require('../models').ProductModel;
const {ObjectId} = require('mongodb');

module.exports = class ProductReviewService {

    attributes;

    constructor() {
        this.attributes = ['_id', 'department_id', 'category_id', 'product_title', 'product_slug', 'attributes', 'reviews', 'images', 'status', 'created_at', 'updated_at', 'deleted_at'];
    }

    async getByUser(in_userId, in_productId) {
        try {
            let productId = ObjectId(in_productId);
            let userId = ObjectId(in_userId);
            let result = await ProductModel.findOne({
                    _id: productId,
                    "reviews.user_id": userId,
                    "reviews.status": {$ne: 'DELETED'},
                },
                this.attributes,
                {sort: {created_at: -1}}
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async insert(productId, in_data) {
        try {
            let result = await ProductModel.findOneAndUpdate({ _id: productId }, { $push: { reviews: in_data } }, { new: true });
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async update(in_productId, in_userId, in_data) {
        try {
            let productId = ObjectId(in_productId);
            let userId = ObjectId(in_userId);
            let result = await ProductModel.findOneAndUpdate(
                {_id: productId, "reviews.user_id": userId},
                {$set: {
                        'reviews.$.user_id': in_data.user_id,
                        'reviews.$.updatedAt': new Date(),
                        'reviews.$.comment': in_data.comment,
                        'reviews.$.first_name': in_data.first_name,
                        'reviews.$.last_name': in_data.last_name,
                        'reviews.$.profile_pic': in_data.profile_pic
                    }
                },
                {new : true}
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async delete(in_productId, in_userId) {
        try {
            let productId = ObjectId(in_productId);
            let userId = ObjectId(in_userId);
            let result = await ProductModel.findOneAndUpdate(
                {_id: productId, "reviews.user_id": userId},
                {$set: {
                        'reviews.$.status': 'DELETED',
                        'reviews.$.deletedAt': new Date()
                    }
                },
                {new : true}
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async exists( productId, userId ) {
        try {
            let result = await ProductModel.countDocuments({
                _id: productId,
                'reviews.user_id': userId
            });
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }
};