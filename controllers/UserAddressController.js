const Validator = require('validatorjs');
const {ObjectId} = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const UserAddressService = require('../services').UserAddressService;
const UserAddressServiceObj = new UserAddressService();

module.exports = class UserAddressController {

    constructor() {

    }

    async getUserAddresses(req, res, next) {
        try {
            // let user_id = ObjectId(req.authData.id ? req.authData.id : req.params.user_id);
            let user_id = ObjectId(req.params.user_id);
            let userAddressesObj = await UserAddressServiceObj.getUserAddresses(user_id);
            return await responseServiceObj.sendResponse(res, {
                msg: 'User Addresses Fetched Successfully',
                data: {
                    user_addresses: userAddressesObj
                }
            });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    async insertUserAddress(req, res, next) {
        try {
            console.log('inside insertUserAddress');
            // console.log('req.authData.id',req.authData.id);
            // console.log('req.params.user_id',req.params.user_id);
            // let user_id = ObjectId(req.authData.id ? req.authData.id : req.params.user_id);
            let user_id = ObjectId(req.params.user_id);
            let dataObj = req.body;
            let rules = {
                full_name: 'required',
                phone_number: 'required|numeric',
                city: 'required|string',
                state: 'required|string',
                address: 'required|string',
                landmark: 'required|string',
                type: 'required|string|in:HOME,WORK',
                title: 'required|string',
                pincode: 'required|numeric',
                email: 'required|email',
                country: 'required|string'
            };
            let validation = new Validator(dataObj, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            let userAddressObj = await UserAddressServiceObj.insertUserAddress(dataObj, user_id);
            return await responseServiceObj.sendResponse(res, {
                msg: 'User Address Saved Successfully',
                data: {
                    user_address: userAddressObj
                }
            });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    async deleteUserAddress(req, res, next) {
        try {
            let user_id = ObjectId(req.params.user_id);
            let address_id = ObjectId(req.params.address_id);
            let result = await UserAddressServiceObj.deleteUserAddress(user_id, address_id);
            return await responseServiceObj.sendResponse(res, {
                msg: 'Address Deleted Successfully',
                data: {
                    user_addresses: result
                }
            });

        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    async updateUserAddress(req, res, next) {
        try {
            // let user_id = ObjectId(req.authData.id ? req.authData.id : req.params.user_id);
            let user_id = ObjectId(req.params.user_id);
            let address_id = ObjectId(req.params.address_id);
            let dataObj = req.body;
            let rules = {
                full_name: 'required',
                phone_number: 'required|numeric',
                city: 'required|string',
                state: 'required|string',
                address: 'required|string',
                landmark: 'required|string',
                type: 'required|string|in:HOME,WORK',
                title: 'required|string',
                pincode: 'required|numeric',
                email: 'required|email',
                country: 'required|string'
            };
            let validation = new Validator(dataObj, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            let userAddressObj = await UserAddressServiceObj.updateUserAddress(dataObj, user_id, address_id);
            return await responseServiceObj.sendResponse(res, {
                msg: 'User Address Updated Successfully',
                data: {
                    user_address: userAddressObj
                }
            });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    async getUserAddressByAddressId(req, res, next) {
        try {
            // let user_id = ObjectId(req.authData.id ? req.authData.id : req.params.user_id);
            let user_id = ObjectId(req.params.user_id);
            let address_id = ObjectId(req.params.address_id);
            let result = await UserAddressServiceObj.getUserAddressByAddressId(user_id, address_id);
            return await responseServiceObj.sendResponse(res, {
                msg: 'User Address By Address Id',
                data: {
                    user_address: result
                }
            });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }
};