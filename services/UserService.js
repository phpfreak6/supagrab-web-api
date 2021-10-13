const UserModel = require('../models').UserModel;
const {ObjectId} = require('mongodb');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var {userImageBasePath, JWT_SECRET} = require('../config/config');

module.exports = class UserService {

    constructor() {}

    async getAllUser(searchTxt) {
        try {

            if (!searchTxt) {

                let result = await UserModel.find(
                        {
                            status: {$ne: 'DELETED'}
                        }, // condition
                        [
                            'parent_id',

                            'first_name',
                            'last_name',
                            'profilePic',

                            'email',
                            'contact_number',

                            'password',
                            'pwd_reset_token',
                            'refresh_token',

                            'gender',
                            'role',
                            'status',

                            'fb_token',
                            'fb_details',

                            'gmail_token',
                            'gmail_details',

                            'account_verification_token',

                            'fcm_device_type',
                            'fcm_token',

                            'addresses',

                            'device_info',

                            'otp_code',

                            'deletedAt',
                            'createdAt',
                            'updatedAt'
                        ], // Columns to Return
                        {
                            sort: {
                                createdAt: -1 //Sort by Date Added DESC
                            }
                        });
                return result;
            } else {

                let result = await UserModel.find({
                    $and: [
                        {

                            $or: [
                                {
                                    email: new RegExp(searchTxt, 'i')
                                },
                                {
                                    first_name: new RegExp(searchTxt, 'i')
                                },
                                {
                                    last_name: new RegExp(searchTxt, 'i')
                                },
                                {
                                    status: new RegExp(searchTxt, 'i')
                                },
                                {
                                    role: new RegExp(searchTxt, 'i')
                                }
                            ],
                            status: {$ne: 'DELETED'}
                        },
                    ],
                },
                        [
                            'parent_id',

                            'first_name',
                            'last_name',
                            'profilePic',

                            'email',
                            'contact_number',

                            'password',
                            'pwd_reset_token',
                            'refresh_token',

                            'gender',
                            'role',
                            'status',

                            'fb_token',
                            'fb_details',

                            'gmail_token',
                            'gmail_details',

                            'account_verification_token',

                            'fcm_device_type',
                            'fcm_token',

                            'addresses',

                            'device_info',

                            'otp_code',

                            'deletedAt',
                            'createdAt',
                            'updatedAt'
                        ], // Columns to Return
                        {
                            sort: {
                                createdAt: -1 //Sort by Date Added DESC
                            }
                        });
                return result;
            }
        } catch (ex) {
            throw ex;
        }
    }

    async getUserById(in_id) {
        try {

            let id = ObjectId(in_id);
            let result = await UserModel.findOne({_id: id, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {

            throw ex;
        }
    }

    async getUserByEmail(email) {
        try {
            let result = await UserModel.findOne({email: email, status: {$ne: 'DELETED'}});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async insertUser(in_data) {
        try {

            // generate salt to hash password
            const salt = await bcrypt.genSalt(10);
            // now we set user password to hashed password
            in_data.password = await bcrypt.hash(in_data.password, salt);
            let result = await UserModel.create(in_data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async updateUser(in_data, in_id) {
        try {

            let id = ObjectId(in_id);
            if( in_data.password ) {
                // generate salt to hash password
                const salt = await bcrypt.genSalt(10);
                // now we set user password to hashed password
                in_data.password = await bcrypt.hash(in_data.password, salt);
            }
            let result = await UserModel.updateOne({_id: id}, in_data, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async deleteUser(in_data, id) {
        try {

            let id = ObjectId(id);
            let result = await UserModel.updateOne({_id: id}, in_data, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async updateUserProfilePic(in_data, in_id) {
        try {
            let id = ObjectId(in_id);
            let result = await UserModel.updateOne({_id: id}, in_data, {multi: false});
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async isUserIdExists(user_id) {
        try {

            let result = await UserModel.countDocuments({_id: user_id});
            let isExists = result > 0 ? true : false;
            return isExists;
        } catch (ex) {
            throw ex;
        }
    }

    async isUserEmailExists(in_email, user_id = false) {
        try {
            if (user_id) {

                let result = await UserModel.countDocuments({
                    email: in_email,
                    _id: {$ne: user_id}
                });
                let isExists = result > 0 ? true : false;
                return isExists;
            } else {

                let result = await UserModel.countDocuments({email: in_email});
                let isExists = result > 0 ? true : false;
                return isExists;
            }
        } catch (ex) {
            throw ex;
    }
    }

    async isUserContactNoExists(in_contact_no, user_id = false) {
        try {

            if (user_id) {

                let result = await UserModel.countDocuments({
                    contact_number: in_contact_no,
                    _id: {$ne: user_id}
                });
                let isExists = result > 0 ? true : false;
                return isExists;
            } else {

                let result = await UserModel.countDocuments({contact_number: in_contact_no});
                let isExists = result > 0 ? true : false;
                return isExists;
            }
        } catch (ex) {
            throw ex;
    }
    }

    async checkSocialUserExists(dataObj) {
        try {
            let result = await UserModel.countDocuments({token: dataObj.token, social_flag: dataObj.social_flag});
            return result > 0 ? true : false;
        } catch (ex) {
            throw ex;
        }

    }

    async createJwtToken(userData) {
        try {
            let result = await jwt.sign(
                {
                    "id": userData.id,
                    "first_name": userData.first_name,
                    "last_name": userData.last_name,
                    "email": userData.email,
                    "dob": userData.dob,
                    "role": userData.role,
                    "status": userData.status,
                    "deletedAt": userData.deletedAt,
                    "createdAt": userData.createdAt,
                    "updatedAt": userData.updatedAt
                },
                JWT_SECRET, 
                {expiresIn: 60 * 60 * 24 * 365 }
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getUserByFeededData(data) {
        try {
            let result = await UserModel.findOne(data);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    validateUserStatus(userObj) {
        try {
            if (['PENDING', 'BLOCK', 'DELETED'].includes(userObj.status)) {
                throw 'Your account status is ' + userObj.status.toLowerCase() + '. Please contact administrator.';
            }
            return true;
        } catch (ex) {
            throw ex;
        }
    }
}