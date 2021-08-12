const DepartmentModel = require('../models').DepartmentModel;
const { ObjectId } = require('mongodb');

module.exports = class CategoryService {

    constructor() {

    }

    async get(searchTxt, in_department_id) {
        try {
            let department_id = ObjectId(in_department_id);
            if (!searchTxt) {
                let result = await DepartmentModel.findOne({ 'categories.department_id': department_id, 'categories.status': { $ne: 'DELETED' } }, ['categories']);
                return (result) ? result.categories : [];
            } else {
                let result = await DepartmentModel.findOne(
                    {
                        $and: [{
                            $or: [
                                { 'categories.title': new RegExp(searchTxt, 'i') }
                            ],
                            'categories.department_id': department_id,
                            'categories.status': { $ne: 'DELETED' }
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
            data.category_title = data.category_title.toLowerCase();
            data.category_slug = data.category_slug.toLowerCase();
            let result = await DepartmentModel.findOneAndUpdate({ _id: data.department_id }, { $push: { categories: data } }, { new: true });
            return result.categories;
        } catch (ex) {
            throw ex;
        }
    }

    async exists(data, in_department_id, in_category_id = false) {
        try {
            let department_id = ObjectId(in_department_id);
            let category_id = (in_category_id) ? ObjectId(in_category_id) : null;
            let result = await DepartmentModel.findOne({ _id: department_id })
                .select({
                    categories: {
                        $elemMatch: {
                            ...(category_id) && { _id: { $ne: category_id } },
                            department_id: department_id,
                            category_title: data.category_title.toLowerCase(),
                            status: { $ne: 'DELETED' }
                        }
                    }
                });
            return (result) && result.categories.length > 0 ? true : false;
        } catch (ex) {
            throw ex;
        }
    }

    async slugExists(data, in_department_id, in_category_id = false) {
        try {
            let department_id = ObjectId(in_department_id);
            let category_id = (in_category_id) ? ObjectId(in_category_id) : null;
            let result = await DepartmentModel.findOne({ _id: department_id })
                .select({
                    categories: {
                        $elemMatch: {
                            ...(category_id) && { _id: { $ne: category_id } },
                            department_id: department_id,
                            category_slug: data.category_slug.toLowerCase(),
                            status: { $ne: 'DELETED' }
                        }
                    }
                });
            return (result) && result.categories.length > 0 ? true : false;
        } catch (ex) {
            throw ex;
        }
    }

    async getById(in_id, in_department_id) {
        try {
            let id = ObjectId(in_id);
            let department_id = ObjectId(in_department_id);
            let result = await DepartmentModel.findOne({
                _id: department_id,
                'categories._id': id,
                'categories.department_id': department_id,
                'categories.status': { $ne: 'DELETED' }
            }).select({
                categories: { $elemMatch: { _id: id } }
            });
            return result ? result.categories[0] : null;
        } catch (ex) {
            throw ex;
        }
    }

    async update(in_department_id, in_id, data) {
        let department_id = ObjectId(in_department_id);
        let id = ObjectId(in_id);
        try {
            let result = await DepartmentModel.findOneAndUpdate(
                { _id: department_id, "categories._id": id },
                {
                    $set: {
                        'categories.$.category_title': data.category_title.toLowerCase(),
                        'categories.$.category_slug': data.category_slug.toLowerCase(),
                        'categories.$.status': data.status,
                        'categories.$.updated_at': new Date()
                    }
                },
                { new: true }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async isIdExists(in_department_id, in_id) {
        try {
            let department_id = ObjectId(in_department_id);
            let id = ObjectId(in_id);
            let result = await DepartmentModel.countDocuments({ _id: department_id, 'categories._id': id });
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async delete(in_department_id, in_id) {
        try {
            let department_id = ObjectId(in_department_id);
            let id = ObjectId(in_id);
            let result = await DepartmentModel.findOneAndUpdate(
                { _id: department_id, 'categories._id': id },
                { $set: { 'categories.$.status': 'DELETED', 'categories.$.deleted_at': new Date() } },
                { new: true }
            );
            return result.categories;
        } catch (ex) {
            throw ex;
        }
    }

    async getBySlug(category_slug) {
        try {
            let result = await DepartmentModel.aggregate([
                {
                    $match: {
                        'categories.category_slug': category_slug.toLowerCase(), 
                        'categories.status': { $ne: 'DELETED' } 
                    }
                }
            ]);
            return result;
        } catch (ex) {
            throw ex;
        }
    }
};