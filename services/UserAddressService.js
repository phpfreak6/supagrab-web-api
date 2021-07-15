const UserModel = require('../models').UserModel;
const {ObjectId} = require('mongodb');

module.exports = class UserAddressService {

    constructor() {

    }

    async getUserAddresses(user_id) {
        try {
            var result = await UserModel.findById(user_id, 'addresses').exec();
            return result.addresses;
        } catch (ex) {
            throw ex;
        }
    }

    async insertUserAddress(dataObj, user_id) {
        try {
            dataObj._id = new ObjectId();
            let result = await UserModel.findOneAndUpdate({_id: ObjectId(user_id)}, {$push: {addresses: dataObj}}).exec();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
};