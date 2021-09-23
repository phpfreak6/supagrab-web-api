const fs = require('fs');
const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const CartService = require('../services').CartService;
const CartServiceObj = new CartService();

const ProductService = require('../services').ProductService;
const ProductServiceObj = new ProductService();

const UserService = require('../services').UserService;
const UserServiceObj = new UserService();

module.exports = class CartController {

    constructor() { }

    insertCart(req, res, next) {

        try {

            let in_data = req.params;

            let rules = {
                user_id: 'required',
                product_id: 'required',
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            let userId = req.params.user_id;
            let productId = req.params.product_id;

            let is_valid;

            is_valid = ObjectId.isValid(userId);
            if (!is_valid) {
                throw 'User id not well formed.'
            }

            is_valid = ObjectId.isValid(productId);
            if (!is_valid) {
                throw 'Product id not well formed.'
            }

            in_data = {
                user_id: ObjectId( userId ),
                product_id: ObjectId( productId )
            };

            ProductServiceObj.getById( productId )
                .then( async (productDetails) => {
                    in_data['product_detail'] = productDetails ? productDetails : [];
                    in_data['product_price'] = productDetails.product_price ? productDetails.product_price : 0;
                    return true;
                } )
                .then( async (out) => {

                    let isExists = await CartServiceObj.isItemExistsInCart( userId, productId );
                    if( isExists ) {
                        throw 'Item already exists in the cart';
                    }

                    let result = await CartServiceObj.insertCart(in_data);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Item added to the cart successfully',
                        data: {
                            cart: await CartServiceObj.getCartByUser( userId )
                        }
                    });
                })
                .catch( async ( ex ) => {
                    return await responseServiceObj.sendException(res, {
                        msg: ex.toString()
                    });
                } );

        } catch (ex) {

            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    updateCart(req, res, next) {

        try {

            let in_id = req.params.id;
            let id = ObjectId(in_id);
            let in_data = req.body;
            let rules = {};
			
			in_data.qty ? rules.qty = 'required|numeric' : '';
			
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            CartServiceObj.updateCart(in_data, id)
                .then(async (result) => {
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Cart updated successfully',
                        data: {
                            cart: await CartServiceObj.getCartById(id)
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

    deleteCart(req, res, next) {
        try {
            
            let is_valid;
            let in_data = req.params;

            let rules = {
                id: 'required',
                user_id: 'required'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            is_valid = ObjectId.isValid(in_data.user_id);
            if (!is_valid) {
                throw 'User id not well formed.'
            }

            is_valid = ObjectId.isValid(in_data.id);
            if (!is_valid) {
                throw 'Cart id not well formed.'
            }

            let user_id = ObjectId( in_data.user_id );
            let cart_id = ObjectId( in_data.id );

            CartServiceObj.isCartIdExists( cart_id )
            .then( async (isExists) => {
                if( !isExists ) {
                    throw 'Invalid cart id.'
                }
                return true;
            } )
            .then( async (inResult) => {
                let result = await CartServiceObj.deleteCart( cart_id );
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record deleted successfully'
                } );
            } )
            .catch( async (ex) => {
                return await responseServiceObj.sendException( res, {
                    msg : ex.toString()
                } );
            } );
        } catch(ex) {
            return responseServiceObj.sendException( res, {
                msg : ex.toString()
            } );
        }
    }

    clearCartByUser(req, res, next) {
        try {
            
            let is_valid;
            let in_data = req.params;

            let rules = {
                user_id: 'required'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            is_valid = ObjectId.isValid(in_data.user_id);
            if (!is_valid) {
                throw 'User id not well formed.'
            }

            let user_id = ObjectId( in_data.user_id );

            UserServiceObj.isUserIdExists( user_id )
            .then( async (isExists) => {
                if( !isExists ) {
                    throw 'Invalid user id.'
                }
                return true;
            } )
            .then( async (inResult) => {
                let result = await CartServiceObj.clearCartByUserId( user_id );
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Cart cleared successfully'
                } );
            } )
            .catch( async (ex) => {
                return await responseServiceObj.sendException( res, {
                    msg : ex.toString()
                } );
            } );
        } catch(ex) {
            return responseServiceObj.sendException( res, {
                msg : ex.toString()
            } );
        }
    }

    getCartByUser(req, res, next) {

        try {

            let in_data = req.params;

            let rules = {
                user_id: 'required'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            let is_valid = ObjectId.isValid(in_data.user_id);
            if (!is_valid) {
                throw 'User id not well formed.'
            }

            let user_id = ObjectId( in_data.user_id );

            CartServiceObj.getCartByUser( in_data.user_id )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        cart: result
                    }
                } );
            } )
            .catch( async (ex) => {
                return await responseServiceObj.sendException( res, {
                    msg : ex.toString()
                } );
            } );
        } catch( ex ) {
            return responseServiceObj.sendException( res, {
                msg : ex.toString()
            } );
        }
    }

    setStatus(req, res, next) {
        try {

            let in_id = req.params.id;
            let id = ObjectId(in_id);
            let in_data = req.body;
            let rules = {
                status: 'required|in:OPEN,CLOSE,DELETED'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            CartServiceObj.isCartIdExists(id)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid cart id.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await CartServiceObj.updateCart(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Cart status updated successfully.',
                        data: {
                            cart: await CartServiceObj.getCartById(id)
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
}