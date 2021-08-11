const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Validator = require("validatorjs");

const UserService = require('../services').UserService;
const UserServiceObj = new UserService();

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

var {userImageBasePath, JWT_SECRET} = require('../config/config');

module.exports = class AuthController {

    constructor() {}

    signIn(req, res, next) {

        try {

            let in_data = req.body;
            let rules = {
                email: 'required|email',
                password: 'required|min:6'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            let email = in_data.email;
            let password = in_data.password;

            UserServiceObj.getUserByEmail(email)
                    .then((result) => {

                        if (result === null) {
                            throw "Email not found!";
                        } else {
                            return result;
                        }
                    })
                    .then( async (result) => {

                        if( result.status == 'PENDING' ) {                            
                            throw 'Account status must be active to login. Current account status is pending.'

                        } else if( result.status == 'BLOCK' ) {
                            throw 'Your account is blocked.'

                        } else if( result.status == 'DELETED' ) {
                            throw 'Your account is deleted.'

                        } else if( result.status == 'ACTIVE' ) {
                            return result;

                        } else {
                            throw 'Unknown account status returned from the database.'
                        }
                    } )
                    .then(async (result) => {

                        if( !result.password ) {
                            throw 'Undefined password';
                        } 

                        const match = await bcrypt.compare(password, result.password);
                        if (!match) {
                            throw "Invalid password!";
                        }
                        let userData = {
                            "id": result.id,
                            "first_name": result.first_name,
                            "last_name": result.last_name,
                            "email": result.email,
                            "dob": result.dob,
                            "role": result.role,
                            "status": result.status,
                            "deletedAt": result.deletedAt,
                            "createdAt": result.createdAt,
                            "updatedAt": result.updatedAt
                        };

                        let token = await UserServiceObj.createJwtToken(userData);
                        return responseServiceObj.sendResponse(res, {
                            msg: 'Authentication Successfull.',
                            data: {token: token, user: result, userImagePath: userImageBasePath}
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

    socialSignIn(req, res, next) {
        try {
            let in_data = req.body;
            let rules = {social_flag: 'required', token: 'required', social_user_detail: 'required'};
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {
                throw responseServiceObj.getFirstError(validation);
            }
            UserServiceObj.checkSocialUserExists(in_data)
                    .then(async(result) => {
                        let token = '';
                        let userObj = '';
                        let socialUserObj = JSON.parse(in_data.social_user_detail);
                        if (result) {
                            let userObj = await UserServiceObj.getUserByFeededData({token: in_data.token, social_flag: in_data.social_flag});
                            UserServiceObj.validateUserStatus(userObj);
                            UserServiceObj.updateUser({social_user_detail: socialUserObj}, userObj._id);
                            token = await UserServiceObj.createJwtToken(userObj);
                            return  responseServiceObj.sendResponse(res, {
                                msg: 'Logged In Successfully',
                                data: {token: token, user: userObj, userImagePath: userImageBasePath}
                            });
                        } else {
                            let insertObj = {
                                first_name: socialUserObj.firstName,
                                last_name: socialUserObj.lastName,
                                token: socialUserObj.id,
                                email: socialUserObj.email,
                                social_user_detail: socialUserObj,
                                social_flag: in_data.social_flag,
                                password: '123456',
                                status: 'ACTIVE'
                            };
                            let userObj = await UserServiceObj.insertUser(insertObj);
                            token = await UserServiceObj.createJwtToken(userObj);
                            return  responseServiceObj.sendResponse(res, {
                                msg: 'User Created Successfully',
                                data: {token: token, user: userObj, userImagePath: userImageBasePath}
                            });
                        }
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

    signOut(req, res, next) {}

    verifyToken(req, res, next) {

        try {

            //Request header with authorization key
            const bearerHeader = req.headers['authorization'];
            // console.log('bearerHeader', bearerHeader);

            //Check if there is  a header
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');

                //Get Token arrray by spliting
                const bearerToken = bearer[1];
                req.token = bearerToken;

                jwt.verify(req.token, JWT_SECRET, (err, authData) => {

                    if (err) {
                        throw err;
                    } else {

                        req.authData = authData;
                        //call next middleware
                        next();
                    }
                });
            } else {
                throw 'Header is not defined.';
            }
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                resCode: 401,
                msg: ex.toString()
            });
        }
    }

    /*
     verifyAccess( req, res, next ) {
     let full_path = req.baseUrl + req.route.path;
     // let roleId = req.authData.roleId;
     let roleId = 2;
     if( accesses.hasOwnProperty( full_path ) ) {
     let authorisedRoles = accesses[full_path];
     if ( authorisedRoles.indexOf( roleId ) > -1 ) {
     //call next middleware
     next();
     } else {
     // Unauthorized Access
     return responseServiceObj.sendException( res, {
     msg : 'Unauthorized access.'
     } );
     }
     } else {
     // Path is not declared in the /config/access.json
     return responseServiceObj.sendException( res, {
     msg : 'Path is not declared in the /config/access.json.'
     } );
     }
     }
     */
}