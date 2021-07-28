const DepartmentModel = require('../models').DepartmentModel;
const {ObjectId} = require('mongodb');

module.exports = class CategoryService {

    constructor() {

    }

    async get(searchTxt, in_department_id) {
        try {
            let department_id = ObjectId(in_department_id);
            if (!searchTxt) {
                let result = await DepartmentModel.findOne({'categories.department_id': department_id, 'categories.status': {$ne: 'DELETED'}}, ['categories']);
                return (result) ? result.categories : [];
            } else {
                let result = await DepartmentModel.findOne(
                        {$and: [{
                                    $or: [
                                        {'categories.title': new RegExp(searchTxt, 'i')}
                                    ],
                                    'categories.department_id': department_id,
                                    'categories.status': {$ne: 'DELETED'}
                                }]
                        },
                        ['categories']
                        );
                return (result) ? result.categories : [];
            }
        } catch (ex) {
            throw ex;
        }
    }

    async insert(data, in_department_id) {
        try {
            data._id = new ObjectId();
            data.department_id = ObjectId(in_department_id);
            data.title = data.title.toLowerCase();
            console.log('data to be inserted', data);
            let result = await DepartmentModel.findOneAndUpdate({_id: data.department_id}, {$push: {categories: data}}, {new : true});
            console.log(result);
            return result.categories;
        } catch (ex) {
            throw ex;
        }
    }

    async exists(data, in_department_id, category_id = false) {
        try {
            let department_id = ObjectId(in_department_id);
            let condition = (category_id) ?
                    {'categories.department_id': department_id, 'categories.title': data.title.toLowerCase(), 'categories.status': {$ne: 'DELETED'}, 'categories._id': {$ne: ObjectId(category_id)}} :
                    {'categories.department_id': department_id, 'categories.title': data.title.toLowerCase(), 'categories.status': {$ne: 'DELETED'}};
            let result = await DepartmentModel.findOne(condition);
            if ((result) && result.categories.length > 0) {
                return true;
            }
            return false;
        } catch (ex) {
            throw ex;
    }
    }

    async getById(in_id) {
        try {
            let id = ObjectId(in_id);
            let result = await DepartmentModel.findOne({_id: id, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async update(in_data, in_id) {
        try {
            let id = ObjectId(in_id);
            let result = await DepartmentModel.updateOne({_id: id}, in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async isIdExists(id) {
        try {
            let result = await DepartmentModel.countDocuments({_id: id});
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

};