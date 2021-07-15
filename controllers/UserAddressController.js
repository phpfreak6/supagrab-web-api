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
            let user_id = req.authData.id ? req.authData.id : req.params.user_id;
            let userAddressesObj = await UserAddressServiceObj.getUserAddresses(user_id);
            return await responseServiceObj.sendResponse(res, {
                msg: 'User Addresses Fetched Successfully',
                data: {
                    userAddressesObj: userAddressesObj,
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
            let user_id = req.authData.id ? req.authData.id : req.params.user_id;
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
            };
            let validation = new Validator(dataObj, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            let userAddressesObj = await UserAddressServiceObj.insertUserAddress(dataObj, user_id);
            return await responseServiceObj.sendResponse(res, {
                msg: 'User Address Saved Successfully',
                data: {
                    userAddressesObj: userAddressesObj
                }
            });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }
};