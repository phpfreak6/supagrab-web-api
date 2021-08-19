const ProductModel = require('../models').ProductModel;
const { ObjectId } = require('mongodb');

module.exports = class ProductAttributeService {

    attributes;

    constructor() {
        this.attributes = ['attributes'];
    }

    async get(productId) {
        try {
            let result = await ProductModel.find(
                { _id: productId, "attributes.status": { $ne: 'DELETED' } },
                this.attributes,
                {sort: {"attributes.created_at": -1}}
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getById( in_productId, in_attributeId ) {

        let result = await ProductModel.aggregate([
            {
                $unwind: "$attributes"
            },
            {
                $match : {
                    "attributes.product_id" : in_productId,
                    "attributes._id" : in_attributeId,
                    "attributes.status" : { $ne: 'DELETED' }
                }
            },
        ]);
        return result;
    }

    async insert(productId, in_data) {
        try {
            console.log('inside service');
            console.log('inside service productId',productId);
            console.log('inside service in_data',in_data);
            let result = await ProductModel.findOneAndUpdate(
                {
                    _id: productId 
                }, 
                { 
                    $push: {
                        attributes: in_data 
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

    async update(in_productId, in_attributeId, in_data) {
        try {
            let productId = ObjectId(in_productId);
            let attributeId = ObjectId(in_attributeId);
            let result = await ProductModel.findOneAndUpdate(
                { _id: productId, "attributes._id": attributeId },
                {
                    $set: {
                        'attributes.$.product_id': in_data.product_id,
                        'attributes.$.tab_name': in_data.tab_name,
                        'attributes.$.tab_value': in_data.tab_value,
                        'attributes.$.updatedAt': new Date(),
                    }
                },
                { new: true }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async delete(in_productId, in_attributeId) {
        try {
            let productId = ObjectId(in_productId);
            let attributeId = ObjectId(in_attributeId);
            let result = await ProductModel.findOneAndUpdate(
                { _id: productId, "attributes._id": attributeId },
                {
                    $set: {
                        'attributes.$.status': 'DELETED',
                        'attributes.$.deletedAt': new Date()
                    }
                },
                { new: true }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async exists(in_productId, in_attributeId) {
        try {
            let result = await ProductModel.countDocuments({
                _id: in_productId,
                'attributes._id': in_attributeId
            });
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }
};