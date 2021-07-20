const fs = require('fs');
const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const FaqService = require('../services').FaqService;
const FaqServiceObj = new FaqService();

module.exports = class FaqController {

    constructor() { }

    insertFaq(req, res, next) {

        try {

            let in_data = req.body;
            let rules = {
                question: 'required',
                answer: 'required',
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            FaqServiceObj.insertFaq(in_data)
                .then(async (result) => {
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Record inserted successfully',
                        data: {
                            faq: result
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

    updateFaq(req, res, next) {

        try {

            let in_id = req.params.id;
            let id = ObjectId(in_id);
            let in_data = req.body;
            let rules = {};
			
			in_data.question ? rules.question = 'required' : '';
			in_data.answer ? rules.answer = 'required' : '';			
			
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            FaqServiceObj.updateFaq(in_data, id)
                .then(async (result) => {
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Record updated successfully',
                        data: {
                            faq: await FaqServiceObj.getFaqById(id)
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

    deleteFaq(req, res, next) {
        try {
            
            let id = ObjectId( req.params.id );
            FaqServiceObj.isFaqIdExists( id )
            .then( async (isExists) => {
                if( !isExists ) {
                    throw 'Invalid faq id.'
                }
                return true;
            } )
            .then( async (inResult) => {
                let in_data = {
                    status: 'DELETED',
                    deletedAt: new Date()
                };
                let result = await FaqServiceObj.updateFaq( in_data, id );
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

    getFaqById(req, res, next) {
        try {
            let id = req.params.id;
            let is_valid = ObjectId.isValid(id);
            if (!is_valid) {
                throw 'Faq id not well formed.'
            }
            id = ObjectId( id );
            FaqServiceObj.getFaqById( id )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        faq: result
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

    getAllFaq(req, res, next) {

        try {

            let searchTxt = req.query.searchTxt;
            FaqServiceObj.getAllFaq( searchTxt )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        faq: result
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

            FaqServiceObj.isFaqIdExists(id)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid faq id.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await FaqServiceObj.updateFaq(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Faq status updated successfully.',
                        data: {
                            faq: await FaqServiceObj.getFaqById(id)
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