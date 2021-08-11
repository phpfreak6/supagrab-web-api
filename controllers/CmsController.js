const fs = require('fs');
const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const CmsService = require('../services').CmsService;
const CmsServiceObj = new CmsService();

module.exports = class CmsController {

    constructor() { }

    insertCms(req, res, next) {

        try {

            let in_data = req.body;
            let rules = {
                key: 'required',
                value: 'required',
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            in_data.key = in_data.key.replace(/ /g,"-");
            CmsServiceObj.isCmsExists( in_data.key )
            .then( async ( isExists ) => {
                if (isExists) {
                    throw `${in_data.key} Key already exists.`
                }
                return true;
            } )
            .then(async (inResult) => {
                let result = await CmsServiceObj.insertCms(in_data);
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Record inserted successfully',
                    data: {
                        cms: result
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

    updateCms(req, res, next) {

        try {

            let in_id = req.params.id;
            let id = ObjectId(in_id);
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

            in_data.key = in_data.key.replace(/ /g,"-");
            CmsServiceObj.isCmsExists( in_data.key, id )
            .then( async ( isExists ) => {
                if (isExists) {
                    throw `${in_data.key} Key already exists.`
                }
                return true;
            } )
            .then( async ( isExists ) => {
                let result = await CmsServiceObj.updateCms(in_data, id);
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Record updated successfully',
                    data: {
                        cms: await CmsServiceObj.getCmsById(id)
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

    deleteCms(req, res, next) {
        try {
            
            let id = ObjectId( req.params.id );
            CmsServiceObj.isCmsExists( id )
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
                let result = await CmsServiceObj.updateCms( in_data, id );
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

    getCmsById(req, res, next) {
        try {
            let id = req.params.id;
            let is_valid = ObjectId.isValid(id);
            if (!is_valid) {
                throw 'Faq id not well formed.'
            }
            id = ObjectId( id );
            CmsServiceObj.getCmsById( id )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        cms: result
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

    getCmsByKey(req, res, next) {
        try {
            let cms_key = req.params.cms_key;
            cms_key = cms_key.replace(/ /g,"-");

            CmsServiceObj.getCmsByKey( cms_key )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        cms: result
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

    getAllCms(req, res, next) {

        try {

            let searchTxt = req.query.searchTxt;
            CmsServiceObj.getAllCms( searchTxt )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        cms: result
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

            CmsServiceObj.isCmsExists(id)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid faq id.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await CmsServiceObj.updateCms(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Faq status updated successfully.',
                        data: {
                            cms: await CmsServiceObj.getCmsById(id)
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

    isCmsExists( req, res, next ) {
        
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
            let cms_key = in_data.cms_key;
            cms_key = cms_key.replace(/ /g,"-");
            
            CmsServiceObj.isCmsExists( cms_key, cms_id )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        cms: result
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
}