const ProductModel = require('../models').ProductModel;
const {ObjectId} = require('mongodb');

module.exports = class DepartmentService {

    attributes;

    constructor() {
        this.attributes = ['_id', 'department_id', 'category_id', 'product_title', 'product_slug', 'attributes', 'reviews', 'images', 'status', 'created_at', 'updated_at', 'deleted_at'];
    }

    async get(searchTxt) {
        try {
            if (!searchTxt) {
                let result = await ProductModel.find(
                        {status: {$ne: 'DELETED'}},
                        // ['_id', 'department_id', 'category_id', 'product_title', 'product_slug', 'attributes', 'reviews', 'images', 'status', 'created_at', 'updated_at', 'deleted_at'],
                        this.attributes,
                        {sort: {created_at: -1}});
                return result;
            } else {
                let result = await ProductModel.find(
                        {$and: [{$or: [{title: new RegExp(searchTxt, 'i')}], status: {$ne: 'DELETED'}}]},
                        // ['_id', 'department_id', 'category_id', 'product_title', 'product_slug', 'attributes', 'reviews', 'images', 'status', 'created_at', 'updated_at', 'deleted_at'],
                        this.attributes,
                        {sort: {created_at: -1}
                        });
                return result;
            }
        } catch (ex) {
            throw ex;
        }
    }

    async insert(in_data) {
        try {
            console.log('in_data', in_data);
            in_data.product_title = in_data.product_title.toLowerCase();
            in_data.product_slug = in_data.product_slug.toLowerCase();
            let result = await ProductModel.create(in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async exists(title, id = false) {
        try {
            let condition = (id) ? {product_title: title.toLowerCase(), _id: {$ne: id}, status: {$ne: 'DELETED'}} : {title: title.toLowerCase(), status: {$ne: 'DELETED'}};
            let result = await ProductModel.countDocuments(condition);
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
    }
    }

    async getById(in_id) {
        try {
            let id = ObjectId(in_id);
            let result = await ProductModel.findOne({_id: id, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async update(in_data, in_id) {
        try {
            let id = ObjectId(in_id);

            if( in_data.product_title ) {
                in_data.product_title = in_data.product_title.toLowerCase();
            }
            if( in_data.product_slug ) {
                in_data.product_slug = in_data.product_slug.toLowerCase();
            }

            let result = await ProductModel.updateOne({_id: id}, in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async isIdExists(id) {
        try {
            let result = await ProductModel.countDocuments({_id: id});
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async isSlugExists(slug) {
        try {
            let result = await ProductModel.countDocuments({slug: slug});
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }
};