const CmsModel = require('../models').CmsModel;
const {ObjectId} = require('mongodb');

module.exports = class FaqService {

    constructor() {}

    async getAllCms(searchTxt) {
        try {

            if (!searchTxt) {

                let result = await CmsModel.find(
                        {
                            status: {$ne: 'DELETED'}
                        }, // condition
                        [
                            'key',
                            'value',

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

                let result = await CmsModel.find({
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
                },
                        [
                            'key',
                            'value',

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

    async getCmsById(in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await CmsModel.findOne({_id: id, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {

            throw ex;
        }
    }

    async getCmsByKey(in_cms_key) {
        try {

            let result = await CmsModel.findOne({ key: in_cms_key, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {

            throw ex;
        }
    }

    async insertCms(in_data) {
        try {

            let result = await CmsModel.create(in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async updateCms(in_data, in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await CmsModel.updateOne({_id: id}, in_data, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async deleteCms(in_data, id) {
        try {

            let id = ObjectId(id);
            let result = await CmsModel.updateOne({_id: id}, in_data, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async isFaqIdExists(in_id) {
        try {

            let result = await CmsModel.countDocuments({_id: in_id});
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async isCmsExists(in_key, in_id = false) {
        try {
            if (in_id) {

                let result = await CmsModel.countDocuments({
                    key: in_key,
                    _id: {$ne: in_id}
                });
                let isExists = result > 0 ? true : false;
                return isExists;
            } else {

                let result = await CmsModel.countDocuments({key: in_key});
                let isExists = result > 0 ? true : false;
                return isExists;
            }
        } catch (ex) {
            throw ex;
        }
    }
}