const fs = require('fs');
const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const ProductAttributeService = require('../services').ProductAttributeService;
const ProductAttributeServiceObj = new ProductAttributeService();

const ProductService = require('../services').ProductService;
const ProductServiceObj = new ProductService();

let PRODUCT_IMAGE_PATH = require('../config/config').PRODUCT_IMAGE_PATH;
let PRODUCT_IMAGE_UPLOAD_PATH = require('../config/config').PRODUCT_IMAGE_UPLOAD_PATH;

module.exports = class ProductAttributeController {

    constructor() { }

    getAll(req, res, next) {

        try {
            let productId = ObjectId(req.params.productId);
            console.log('productId', productId);
            ProductAttributeServiceObj.get(productId)
            .then(async (result) => {
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Record found successfully',
                    data: {
                        product: result
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

            let productId = ObjectId(req.params.productId);
            console.log('inside insert productId', productId);
            let in_data = req.body;
            let rules = {
                tab_name: 'required',
                tab_value: 'required',
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            in_data.product_id = productId;
            console.log('prod insert in_data', in_data);
            ProductAttributeServiceObj.insert(productId, in_data)
            .then(async (result) => {
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Record inserted successfully',
                    data: {
                        product: await ProductServiceObj.getById(productId),
                        PRODUCT_IMAGE_PATH: PRODUCT_IMAGE_PATH
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

    update(req, res, next) {

        try {

            let productId = ObjectId(req.params.productId);
            let id = ObjectId(req.params.id);
            let in_data = req.body;
            let rules = {};
			
			in_data.key ? rules.key = 'required' : '';
			in_data.value ? rules.value = 'required' : '';			
			
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            // ProductAttributeServiceObj.exists( in_data.key, id )
            // .then( async ( isExists ) => {
            //     if (isExists) {
            //         throw `${in_data.key} Key already exists.`
            //     }
            //     return true;
            // } )

            in_data.product_id = productId;
            ProductAttributeServiceObj.update(productId, id, in_data)
            .then( async ( result ) => {
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Record updated successfully',
                    data: {
                        product: await ProductServiceObj.getById(productId),
                        PRODUCT_IMAGE_PATH: PRODUCT_IMAGE_PATH
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

    delete(req, res, next) {
        try {
            let productId = ObjectId(req.params.productId);
            let id = ObjectId(req.params.id);
            ProductAttributeServiceObj.exists( productId, id )
            .then( async (isExists) => {
                if( !isExists ) {
                    throw 'Invalid ids.'
                }
                return true;
            } )
            .then( async (inResult) => {
                let result = await ProductAttributeServiceObj.delete( productId, id );
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

    getById(req, res, next) {
        try {
            let productId = ObjectId(req.params.productId);
            let id = req.params.id;
            let is_valid = ObjectId.isValid(id);
            if (!is_valid) {
                throw 'Faq id not well formed.'
            }
            id = ObjectId( id );
            ProductAttributeServiceObj.getById( productId, id )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        product: result,
                        PRODUCT_IMAGE_PATH: PRODUCT_IMAGE_PATH
                    }
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

            ProductAttributeServiceObj.exists(id)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid faq id.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await ProductAttributeServiceObj.update(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Faq status updated successfully.',
                        data: {
                            product: await ProductAttributeServiceObj.getById(id),
                            PRODUCT_IMAGE_PATH: PRODUCT_IMAGE_PATH
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

    exists( req, res, next ) {
        
        try {

            let in_data = req.params;
            let rules = {
                cms_key: 'required',
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            let cms_id = in_data.cms_id ? in_data.cms_id : false;
            
            ProductAttributeServiceObj.exists( cms_key, cms_id )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        product: result
                    }
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
};