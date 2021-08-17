const ProductModel = require('../models').ProductModel;
const { ObjectId } = require('mongodb');

module.exports = class ProductRatingService {

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
                "reviews.status": { $ne: 'DELETED' },
            },
                this.attributes,
                { sort: { created_at: -1 } }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async insert(productId, in_data) {
        try {
            let result = await ProductModel.findOneAndUpdate({ _id: productId }, { $push: { ratings: in_data } }, { new: true });
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getReviewsCnt(productId) {
        try {

            let result = await ProductModel.aggregate([
                { $match: { _id: productId } },
                {
                    $unwind: "$reviews"
                },
                {
                    $replaceRoot: {
                        newRoot: "$reviews"
                    }
                },
                {
                    $count: "count"
                }
            ]);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getRatingCnt(productId) {
        try {

            let result = await ProductModel.aggregate([
                { $match: { _id: productId } },
                {
                    $unwind: "$ratings"
                },
                {
                    $replaceRoot: {
                        newRoot: "$ratings"
                    }
                },
                {
                    $count: "count"
                }
            ]);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getRatingSum(productId) {
        try {

            let result = await ProductModel.aggregate([
                { $match: { _id: productId } },
                {
                    $unwind: "$ratings"
                },
                {
                    $group: {
                        _id: null, 
                        sum: { $sum: '$ratings.rating' } 
                    }
                }
            ]);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async setRatingCnt(productId, flag) {
        try {

            let ratingCntResult = await this.getRatingCnt( productId );
            let ratingUsrCnt = 0;
            ratingUsrCnt = ratingCntResult[0].count;
            if( !flag ) {
                ratingUsrCnt++;
            }

            let ratingSumResult = await this.getRatingSum( productId );
            let ratingSum = 0;
            ratingSum = ratingSumResult[0].sum;

            let avg = ( ratingSum / ratingUsrCnt );

            let in_data = {
                ratings_cnt: ratingUsrCnt,
                ratings_avg: avg
            };
            let result = await ProductModel.findOneAndUpdate({_id: productId}, in_data);
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
                { _id: productId, "ratings.user_id": userId },
                {
                    $set: {
                        'ratings.$.user_id': in_data.user_id,
                        'ratings.$.updatedAt': new Date(),
                        'ratings.$.rating': in_data.rating,
                        'ratings.$.first_name': in_data.first_name,
                        'ratings.$.last_name': in_data.last_name,
                        'ratings.$.profile_pic': in_data.profile_pic
                    }
                },
                { new: true }
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
                { _id: productId, "reviews.user_id": userId },
                {
                    $set: {
                        'reviews.$.status': 'DELETED',
                        'reviews.$.deletedAt': new Date()
                    }
                },
                { new: true }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async exists(productId, userId) {
        try {
            let result = await ProductModel.countDocuments({
                _id: productId,
                'ratings.user_id': userId
            });
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }
};