const DepartmentModel = require('../models').DepartmentModel;
const { ObjectId } = require('mongodb');

module.exports = class DepartmentService {

    constructor() {

    }

    async get(searchTxt) {
        try {
            if (!searchTxt) {
                let result = await DepartmentModel.find(
                    { status: { $ne: 'DELETED' } },
                    ['_id', 'department_title', 'department_slug', 'categories', 'status', 'created_at', 'updated_at', 'deleted_at'],
                    { sort: { created_at: -1 } });
                return result;
            } else {
                let result = await DepartmentModel.find(
                    { $and: [{ $or: [{ title: new RegExp(searchTxt, 'i') }], status: { $ne: 'DELETED' } }] },
                    ['_id', 'department_title', 'department_slug', 'categories', 'status', 'created_at', 'updated_at', 'deleted_at'],
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
            in_data.department_title = in_data.department_title.toLowerCase();
            in_data.department_slug = in_data.department_slug.toLowerCase();
            let result = await DepartmentModel.create(in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async update(in_data, in_id) {
        try {
            let id = ObjectId(in_id);
            let result = await DepartmentModel.updateOne({ _id: id }, in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async exists(department_title, id = false) {
        try {
            let condition = (id) ? { department_title: department_title.toLowerCase(), _id: { $ne: id }, status: { $ne: 'DELETED' } } : { department_title: department_title.toLowerCase(), status: { $ne: 'DELETED' } };
            let result = await DepartmentModel.countDocuments(condition);
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async slugExists(department_slug, id = false) {
        try {
            let condition = (id) ? { department_slug: department_slug.toLowerCase(), _id: { $ne: id }, status: { $ne: 'DELETED' } } : { department_slug: department_slug.toLowerCase(), status: { $ne: 'DELETED' } };
            let result = await DepartmentModel.countDocuments(condition);
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async getBySlug(department_slug) {
        try {
            let condition = { department_slug: department_slug.toLowerCase(), status: { $ne: 'DELETED' } };
            let result = await DepartmentModel.findOne(condition);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getById(in_id) {
        try {
            let id = ObjectId(in_id);
            let result = await DepartmentModel.findOne({ _id: id, status: { $ne: 'DELETED' } });
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async isIdExists(id) {
        try {
            let result = await DepartmentModel.countDocuments({ _id: id });
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }
};