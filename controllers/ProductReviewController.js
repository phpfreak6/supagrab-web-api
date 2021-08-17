const fs = require('fs');
const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const ProductReviewService = require('../services').ProductReviewService;
const ProductReviewServiceObj = new ProductReviewService();

let PRODUCT_IMAGE_PATH = require('../config/config').PRODUCT_IMAGE_PATH;
let PRODUCT_IMAGE_UPLOAD_PATH = require('../config/config').PRODUCT_IMAGE_UPLOAD_PATH;

let USER_IMAGE_BASE_PATH = require('../config/config').USER_IMAGE_BASE_PATH;
let USER_IMAGE_UPLOAD_PATH = require('../config/config').USER_IMAGE_UPLOAD_PATH;

module.exports = class ProductReviewController {

    constructor() { }

    getByUser(req, res, next) {
        try {
            let userId = req.authData.id ? ObjectId(req.authData.id) : ObjectId(req.params.user_id);
            let productId = ObjectId(req.params.productId);

            ProductReviewServiceObj.getByUser(userId, productId)
                .then(async (result) => {
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Product Review Fetched Successfully',
                        data: { 
                            product: result,
                            PRODUCT_IMAGE_PATH: PRODUCT_IMAGE_PATH,
                            USER_IMAGE_BASE_PATH: USER_IMAGE_BASE_PATH,
                        }
                    });
                })
                .catch(async (ex) => {
                    return await responseServiceObj.sendException(res, {
                        msg: ex.toString()
                    });
                });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    insert(req, res, next) {
        try {

            let reviewExists = false;
            let userId = req.authData.id ? ObjectId(req.authData.id) : ObjectId(req.params.user_id);
            let productId = ObjectId(req.params.productId);
            let in_data = req.body;
            let rules = {
                comment: 'required'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            in_data.product_id = productId;
            in_data.user_id = userId;

            ProductReviewServiceObj.exists(productId, userId)
                .then((result) => {
                    if (result) {
                        reviewExists = result;
                    } else {
                        reviewExists = result;
                    }
                })
                .then( async (result) => {
                    const UserService = require('../services').UserService;
                    const UserServiceObj = new UserService();

                    let user = await UserServiceObj.getUserById(userId);
                    if( user ) {
                        in_data.first_name = user.first_name;
                        in_data.last_name = user.last_name;
                        in_data.profile_pic = user.profilePic;
                        return true;
                    } else {
                        throw 'Invalid user';
                    }
                })
                .then(async (result) => {
                    let product;
                    if( reviewExists ) {
                        product = await ProductReviewServiceObj.update(productId, userId, in_data);
                    } else {
                        product = await ProductReviewServiceObj.insert(productId, in_data);
                    }
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Product Inserted Successfully',
                        data: { 
                            product: product 
                        }
                    });
                })
                .catch(async (ex) => {
                    return await responseServiceObj.sendException(res, { msg: ex.toString() });
                });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    delete(req, res, next) {
        try {
            let userId = req.authData.id ? ObjectId(req.authData.id) : ObjectId(req.params.user_id);
            let productId = ObjectId(req.params.productId);
            
            ProductReviewServiceObj.delete(productId, userId)
            .then(async (inResult) => {
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Review Deleted Successfully'
                });
            })
            .catch(async (ex) => {
                return await responseServiceObj.sendException(res, {
                    msg: ex.toString()
                });
            });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }
};