const fs = require('fs');
const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const CouponService = require('../services').CouponService;
const CouponServiceObj = new CouponService();

module.exports = class CouponController {

    constructor() { }

    insert(req, res, next) {

        try {

            let in_data = req.body;
            let rules = {
                coupon_title: 'required',
                coupon_code: 'required',
                coupon_description: 'required',
                coupon_max_uses: 'required|numeric',
                coupon_uses_yet: 'required|numeric',
                coupon_type: 'required',
                discount_amount: 'required|numeric',
                opened_at: 'required|date',
                expired_at: 'required|date'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            let coupon_code = in_data.coupon_code;
            coupon_code = coupon_code.replace(/\s+/g, '-').toUpperCase();
            CouponServiceObj.isCodeExists(coupon_code)
            .then( async ( isExists ) => {

                if( isExists ) {
                    throw 'Coupon code exists already';
                } else {
                    return true;
                }
            } )
            .then( async (out) => {

                let result = await CouponServiceObj.insert(in_data);
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Record inserted successfully',
                    data: {
                        coupon: result
                    }
                });
            } )
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

    update(req, res, next) {

        try {

            let in_id = req.params.id;
            let id = ObjectId(in_id);
            let in_data = req.body;
            let rules = {};
            
            in_data.coupon_title ? rules.coupon_title = 'required' : '';
            in_data.coupon_code ? rules.coupon_code = 'required' : '';
            in_data.coupon_description ? rules.coupon_description = 'required' : '';
            in_data.coupon_max_uses ? rules.coupon_max_uses = 'required|numeric' : '';
            in_data.coupon_uses_yet ? rules.coupon_uses_yet = 'required|numeric' : '';
            in_data.coupon_type ? rules.coupon_type = 'required|in:FLAT,PERCENTAGE' : '';
            in_data.discount_amount ? rules.discount_amount = 'required|numeric' : '';            
            in_data.opened_at ? rules.opened_at = 'required|date' : '';
            in_data.expired_at ? rules.expired_at = 'required|date' : '';            
            in_data.status ? rules.status = 'required|in:OPEN,CLOSE,DELETED' : '';
			
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            CouponServiceObj.isCodeExists( in_data.coupon_code, id )
            .then( async ( isExists ) => {
                if (isExists) {
                    throw 'Coupon code exists already';
                }
                return true;
            } )
            .then( async ( isExists ) => {
                let result = await CouponServiceObj.update(in_data, id);
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Record updated successfully',
                    data: {
                        coupon: await CouponServiceObj.getById(id)
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
            
            let id = ObjectId( req.params.id );
            CouponServiceObj.isIdExists( id )
            .then( async (isExists) => {
                if( !isExists ) {
                    throw 'Invalid Coupon id.'
                }
                return true;
            } )
            .then( async (inResult) => {
                let in_data = {
                    status: 'DELETED',
                    deletedAt: new Date()
                };
                let result = await CouponServiceObj.update( in_data, id );
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
            let id = req.params.id;
            let is_valid = ObjectId.isValid(id);
            if (!is_valid) {
                throw 'Coupon id not well formed.'
            }
            id = ObjectId( id );
            CouponServiceObj.getById( id )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        coupon: result
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

    getByCode(req, res, next) {
        try {
            let code = req.params.code;
            CouponServiceObj.getByCode( code )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        coupon: result
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

    getAll(req, res, next) {

        try {

            let searchTxt = req.query.searchTxt;
            CouponServiceObj.getAll( searchTxt )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        coupon: result
                    },
                    cnt: await CouponServiceObj.getAllCount( searchTxt )
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

            CouponServiceObj.isCmsExists(id)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid Coupon id.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await CouponServiceObj.updateCms(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Faq status updated successfully.',
                        data: {
                            coupon: await CouponServiceObj.getById(id)
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

    isExists(req, res, next) {
        try {
            let id = req.params.id;
            let is_valid = ObjectId.isValid(id);
            if (!is_valid) {
                throw 'Coupon id not well formed.'
            }
            id = ObjectId( id );
            CouponServiceObj.isIdExists(id)
                .then(async (result) => {
                    if (result) {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Coupon ID Already Exists',
                            data: { exists: true }
                        });
                    } else {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Coupon ID not exists',
                            data: { exists: false }
                        });
                    }
                }).catch(async (ex) => {
                    return await responseServiceObj.sendException(res, { msg: ex.toString() });
                });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    isCodeExists(req, res, next) {
        try {
            let code = req.params.code;
            CouponServiceObj.isCodeExists(code)
                .then(async (result) => {
                    if (result) {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Coupon Code Already Exists',
                            data: { exists: true }
                        });
                    } else {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Coupon Code is not exist',
                            data: { exists: false }
                        });
                    }
                }).catch(async (ex) => {
                    return await responseServiceObj.sendException(res, { msg: ex.toString() });
                });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    setStatus(req, res, next) {
        try {

            let in_id = req.params.id;
            let id = ObjectId(in_id);
            let in_data = req.body;
            let rules = {
                status: 'required|in:OPEN,CLOSE'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            CouponServiceObj.isIdExists(id)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid coupon id.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await CouponServiceObj.update(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Coupon status updated successfully.',
                        data: {
                            user: await CouponServiceObj.getById(id)
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