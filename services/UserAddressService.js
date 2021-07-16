const UserModel = require('../models').UserModel;
const {ObjectId} = require('mongodb');

module.exports = class UserAddressService {

    constructor() {

    }

    async getUserAddresses(in_user_id) {
        try {
            let user_id = ObjectId(in_user_id);
            let result = await UserModel.findById(user_id, 'addresses');
            return result.addresses;
        } catch (ex) {
            throw ex;
        }
    }

    async insertUserAddress(dataObj, in_user_id) {
        try {
            let user_id = ObjectId(in_user_id);
            dataObj._id = new ObjectId();
            let result = await UserModel.findOneAndUpdate({_id: user_id}, {$push: {addresses: dataObj}}, {new : true});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async deleteUserAddress(in_user_id, in_address_id) {
        try {
            let user_id = ObjectId(in_user_id);
            let address_id = ObjectId(in_address_id);
            let result = await UserModel.findOneAndUpdate({_id: user_id}, {$pull: {addresses: {_id: address_id}}}, {new : true});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async updateUserAddress(dataObj, in_user_id, in_address_id) {
        try {
            let user_id = ObjectId(in_user_id);
            let address_id = ObjectId(in_address_id);
            let result = await UserModel.findOneAndUpdate(
                    {_id: user_id, "addresses._id": address_id},
                    {$set: {
                            'addresses.$._id': address_id,
                            'addresses.$.full_name': dataObj.full_name,
                            'addresses.$.phone_number': dataObj.phone_number,
                            'addresses.$.alternate_phone_number': dataObj.alternate_phone_number,
                            'addresses.$.city': dataObj.city,
                            'addresses.$.state': dataObj.state,
                            'addresses.$.address': dataObj.address,
                            'addresses.$.landmark': dataObj.landmark,
                            'addresses.$.type': dataObj.type,
                            'addresses.$.title': dataObj.title,
                            'addresses.$.pincode': dataObj.pincode,
                            'addresses.$.email': dataObj.email,
                            'addresses.$.country': dataObj.country
                        }
                    },
                    {new : true}
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getUserAddressByAddressId(user_id, address_id) {
        try {
            let result = await UserModel
                    .findOne({_id: user_id, "addresses._id": address_id})
                    .select({addresses: {$elemMatch: {_id: address_id}}});
            return result.addresses[0];
        } catch (ex) {
            throw ex;
        }
    }

};