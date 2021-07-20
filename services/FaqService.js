const FaqModel = require('../models').FaqModel;
const {ObjectId} = require('mongodb');

module.exports = class FaqService {

    constructor() {}

    async getAllFaq(searchTxt) {
        try {

            if (!searchTxt) {

                let result = await FaqModel.find(
                        {
                            status: {$ne: 'DELETED'}
                        }, // condition
                        [
                            'question',
                            'answer',

                            'status',

                            'deletedAt',
                            'createdAt',
                            'updatedAt'
                        ], // Columns to Return
                        {
                            sort: {
                                createdAt: -1 //Sort by Date Added DESC
                            }
                        });
                return result;
            } else {

                let result = await FaqModel.find({
                    $and: [
                        {

                            $or: [
                                {
                                    question: new RegExp(searchTxt, 'i')
                                },
                                {
                                    answer: new RegExp(searchTxt, 'i')
                                }
                            ],
                            status: {$ne: 'DELETED'}
                        },
                    ],
                },
                        [
                            'question',
                            'answer',

                            'status',

                            'deletedAt',
                            'createdAt',
                            'updatedAt'
                        ], // Columns to Return
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

    async getFaqById(in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await FaqModel.findOne({_id: id, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {

            throw ex;
        }
    }

    async insertFaq(in_data) {
        try {

            let result = await FaqModel.create(in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async updateFaq(in_data, in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await FaqModel.updateOne({_id: id}, in_data, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async deleteFaq(in_data, id) {
        try {

            let id = ObjectId(id);
            let result = await FaqModel.updateOne({_id: id}, in_data, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async isFaqIdExists(user_id) {
        try {

            let result = await FaqModel.countDocuments({_id: user_id});
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }
}