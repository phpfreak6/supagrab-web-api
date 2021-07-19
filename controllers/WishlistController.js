const Validator = require('validatorjs');
const {ObjectId} = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const WishlistService = require('../services').WishlistService;
const WishlistServiceObj = new WishlistService();

module.exports = class WishlistController {

    constructor() {

    }

    async getWishlistItems(req, res, next) {
        try {
            let user_id = ObjectId(req.authData.id ? req.authData.id : req.params.user_id);
            let wishlistItemsObj = await WishlistServiceObj.getWishlistItems(user_id);
            return await responseServiceObj.sendResponse(res, {
                msg: 'Wishlist Items Successfully',
                data: {
                    wishlist_items: wishlistItemsObj
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
            let user_id = ObjectId(req.authData.id ? req.authData.id : req.params.user_id);
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
            let user_id = ObjectId(req.authData.id ? req.authData.id : req.params.user_id);
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
            let user_id = ObjectId(req.authData.id ? req.authData.id : req.params.user_id);
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