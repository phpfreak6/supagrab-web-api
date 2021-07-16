const UserModel = require('../models').UserModel;
const {ObjectId} = require('mongodb');

module.exports = class UserAddressService {

    constructor() {

    }

    async getUserAddresses(in_user_id) {
        try {
            user_id = ObjectId(in_user_id);
            var result = await UserModel.findById(user_id, 'addresses');
            return result.addresses;
        } catch (ex) {
            throw ex;
        }
    }

    async insertUserAddress(dataObj, in_user_id) {
        try {
            user_id = ObjectId(in_user_id);
            dataObj._id = new ObjectId();
            let result = await UserModel.findOneAndUpdate({_id: user_id}, {$push: {addresses: dataObj}});
            return result;
        } catch (ex) {
            throw ex;
        }
    }
};