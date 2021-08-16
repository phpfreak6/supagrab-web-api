const fs = require('fs');
const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const UserService = require('../services').UserService;
const UserServiceObj = new UserService();

var userImagePath = require('../config/config').userImageBasePath;
var userImageUploadPath = require('../config/config').userImageUploadPath;

module.exports = class UserController {

    constructor() { }

    insertUser(req, res, next) {

        try {

            let in_data = req.body;
            let rules = {
                first_name: 'required',
                email: 'required|email',
                password: 'required|min:6',
                contact_number: 'required|min:10',
                role: 'required|in:ADMIN,SUB_ADMIN,CUSTOMER',
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            UserServiceObj.isUserEmailExists(in_data.email)
                .then(async (isExists) => {
                    if (isExists) {
                        throw 'Email already exists.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let isExists = await UserServiceObj.isUserContactNoExists(in_data.contact_number)
                    if (isExists) {
                        throw 'Contact number already exists.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await UserServiceObj.insertUser(in_data);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Record inserted successfully',
                        data: {
                            user: result,
                            userImagePath: userImagePath
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

    updateUser(req, res, next) {

        try {

            let in_id = req.params.id;
            let id = ObjectId(in_id);
            let in_data = req.body;
            let rules = {};
			
			in_data.first_name ? rules.first_name = 'required' : '';
			in_data.email ? rules.email = 'required|email' : '';
			in_data.password ? rules.password = 'required|min:6' : '';
			in_data.contact_number ? rules.contact_number = 'required|min:10' : '';
			in_data.role ? rules.role = 'required|in:ADMIN,SUB_ADMIN,CUSTOMER' : '';
			
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            UserServiceObj.isUserEmailExists(in_data.email, id)
                .then(async (isExists) => {
                    if (isExists) {
                        throw 'Email already exists.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let isExists = await UserServiceObj.isUserContactNoExists(in_data.contact_number, id)
                    if (isExists) {
                        throw 'Contact number already exists.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await UserServiceObj.updateUser(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Record updated successfully',
                        data: {
                            user: await UserServiceObj.getUserById(id),
                            userImagePath: userImagePath
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

    deleteUser(req, res, next) {
        try {
            
            let id = ObjectId( req.params.id );
            UserServiceObj.isUserIdExists( id )
            .then( async (isExists) => {
                if( !isExists ) {
                    throw 'Invalid user id.'
                }
                return true;
            } )
            .then( async (inResult) => {
                let in_data = {
                    status: 'DELETED',
                    deletedAt: new Date()
                };
                let result = await UserServiceObj.updateUser( in_data, id );
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

    getUserById(req, res, next) {
        try {
            let id = req.params.id;
            let is_valid = ObjectId.isValid(id);
            if (!is_valid) {
                throw 'User id not well formed.'
            }
            id = ObjectId( id );
            UserServiceObj.getUserById( id )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        user: result,
                        userImagePath: userImagePath
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

    getAllUser(req, res, next) {

        try {

            let searchTxt = req.query.searchTxt;
            UserServiceObj.getAllUser( searchTxt )
            .then( async (result) => {
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Record found',
                    data : {
                        user: result,
                        userImagePath: userImagePath
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

    changeProfilePic(req, res, next) {
        try {
            
            let id = req.params.id;
            let is_valid = ObjectId.isValid(id);
            if (!is_valid) {
                throw 'User id not well formed.'
            }
            id = ObjectId(id);
            
            UserServiceObj.isUserIdExists(id)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid user id.'
                    }
                } )
                .then( async ( isExists ) => {

                    let imageDetails = req.params.imageDetails;
                    let in_data = {
                        profilePic : imageDetails.fullFileName,
                        updatedAt : new Date()
                    };
                    
                    let result = await UserServiceObj.updateUser( in_data, id );
                    return await responseServiceObj.sendResponse( res, {
                        msg : 'Profile pic uploaded successfully',
                        data : {
                            user: await UserServiceObj.getUserById( id ),
                            userImagePath: userImagePath
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
                status: 'required|in:PENDING,ACTIVE,BLOCK,DELETED'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            UserServiceObj.isUserIdExists(id)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid user id.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await UserServiceObj.updateUser(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'User status updated successfully.',
                        data: {
                            user: await UserServiceObj.getUserById(id),
                            userImagePath: userImagePath
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

    deleteUserProfilePic( req, res, next ) {

        try {

            let id = ObjectId( req.params.id );
            let path = req.params.profilePic;
            UserServiceObj.isUserIdExists( id )
            .then( async (isExists) => {
                if( !isExists ) {
                    throw 'Invalid user id.'
                }
                return true;
            } )
            .then( async( inResult ) => {

                let file = userImageUploadPath +'/'+ path;
                if (!fs.existsSync(file)) {
                    throw 'File not exists.';
                }
                fs.unlinkSync( file );
            } )
            .then( async (inResult) => {
                let in_data = {
                    profilePic: null
                };
                let result = await UserServiceObj.updateUser( in_data, id );
                return await responseServiceObj.sendResponse( res, {
                    msg : 'Image deleted successfully',
                    data: {
                        user: await UserServiceObj.getUserById(id),
                        userImagePath: userImagePath
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