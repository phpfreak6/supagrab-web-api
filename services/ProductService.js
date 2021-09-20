const ProductModel = require('../models').ProductModel;
const { ObjectId } = require('mongodb');

module.exports = class ProductService {

    attributes;

    constructor() {
        this.attributes = ['_id', 'department_id', 'category_id', 'product_title', 'product_slug', 'product_price', 'attributes', 'reviews', 'images', 'status', 'created_at', 'updated_at', 'deleted_at'];
    }

    async get(searchTxt) {
        try {
            if (!searchTxt) {
                let result = await ProductModel.find(
                    { status: { $ne: 'DELETED' } },
                    // ['_id', 'department_id', 'category_id', 'product_title', 'product_slug', 'attributes', 'reviews', 'images', 'status', 'created_at', 'updated_at', 'deleted_at'],
                    this.attributes,
                    { sort: { created_at: -1 } });
                return result;
            } else {
                let result = await ProductModel.find(
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
            in_data.product_title = in_data.product_title.toLowerCase();
            in_data.product_slug = in_data.product_slug.toLowerCase();
            let result = await ProductModel.create(in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async exists(product_title, id = false) {
        try {
            let condition = (id) ? { product_title: product_title.toLowerCase(), _id: { $ne: id }, status: { $ne: 'DELETED' } } : { product_title: product_title.toLowerCase(), status: { $ne: 'DELETED' } };
            let result = await ProductModel.countDocuments(condition);
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async slugExists(product_slug, id = false) {
        try {
            let condition = (id) ? { product_slug: product_slug.toLowerCase(), _id: { $ne: id }, status: { $ne: 'DELETED' } } : { product_slug: product_slug.toLowerCase(), status: { $ne: 'DELETED' } };
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
            let result = await ProductModel.findOne({ _id: id, status: { $ne: 'DELETED' } });
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async update(in_data, in_id) {
        try {
            let id = ObjectId(in_id);

            if (in_data.product_title) {
                in_data.product_title = in_data.product_title.toLowerCase();
            }
            if (in_data.product_slug) {
                in_data.product_slug = in_data.product_slug.toLowerCase();
            }

            let result = await ProductModel.updateOne({ _id: id }, in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async isIdExists(in_id) {
        try {
            let id = ObjectId(in_id);
            let result = await ProductModel.countDocuments({ _id: id });
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async isSlugExists(slug) {
        try {
            let result = await ProductModel.countDocuments({ slug: slug });
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async getByDepartment(in_id) {
        try {
            let id = ObjectId(in_id);
            let result = await ProductModel.find({
                department_id: id,
                status: { $ne: 'DELETED' }
            });
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getByCategory(in_id) {
        try {
            let id = ObjectId(in_id);
            let result = await ProductModel.find({
                category_id: id,
                status: { $ne: 'DELETED' }
            });
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async setStatus(in_data, in_id) {
        try {
            let id = ObjectId(in_id);
            let result = await ProductModel.updateOne({ _id: id }, in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async insertImage(in_productId, in_data) {
        try {
            
            let productId = in_productId;
            let result = await ProductModel.findOneAndUpdate(
                {
                    _id: productId
                },
                {
                    $push: {
                        images: in_data
                    }
                },
                {
                    new: true
                }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async deleteImage(in_productId, in_imageId) {
        try {
            let imageId = ObjectId(in_imageId);
            let productId = ObjectId(in_productId);
            let result = await ProductModel.findOneAndUpdate(
                {
                    _id: productId
                },
                {
                    $pull: {
                        images: {
                            _id: imageId
                        }
                    }
                },
                {
                    new: true
                }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async setAllImagePrimaryFalse(productId) {
        try {
            let result = await ProductModel.updateMany(
                { _id: productId },
                {
                    $set: {
                        "images.$[elem].default": false,
                        "images.$[elem].updated_at": new Date()
                    }
                },
                {
                    arrayFilters: [{ "elem.default": true }],
                    multi: true
                }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async setImagePrimary(productId, imageId, data) {
        try {

            // set all images primary as false
            let qry = await this.setAllImagePrimaryFalse(productId);

            // set selected image as primary
            let result = await ProductModel.findOneAndUpdate(
                { _id: productId, "images._id": imageId },
                {
                    $set: {
                        'images.$.default': data.default,
                        'images.$.updated_at': new Date()
                    }
                },
                { new: true }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getByProductSlug( in_product_slug ) {
        try {
            let product_slug = in_product_slug;
            let result = await ProductModel.findOne({ product_slug: product_slug, status: { $ne: 'DELETED' } });
            return result;
        } catch (ex) {
            throw ex;
        }
    }
};