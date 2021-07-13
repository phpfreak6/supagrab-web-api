const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ROLES = ['ADMIN', 'SUB_ADMIN', 'CUSTOMER'];
const GENDER = ['MALE', 'FEMALE'];
const STATUSES = ['PENDING', 'ACTIVE', 'BLOCK', 'DELETED'];
const DEVICE_TYPE = ['WEB', 'IPHONE', 'ANDROID'];
const dated = new Date();

const UserSchema = new Schema({
    parent_id: { type: ObjectId, default: null },

	first_name: { type: String },
	last_name: { type: String, default: null },
    profilePic: { type: String, default: null },
        
    email: { type: String, unique: true },
    contact_number: { type: String, unique: true, default: null },

    password: { type: String, default: null },
    pwd_reset_token: { type: String, default: null },
    refresh_token: { type: String, default: null },
    
    gender: { type: String, enum: GENDER, default: 'MALE' },
    role: { type: String, enum: ROLES, default: 'CUSTOMER' },
    status: { type: String, enum: STATUSES, default: 'PENDING' },

    fb_token: { type: String, default: null },
    fb_details: { type: String, default: null },

    gmail_token: { type: String, default: null },
    gmail_details: { type: String, default: null },
    
    account_verification_token: { type: String, default: null },

    fcm_device_type: { type: String, enum: DEVICE_TYPE, default: 'WEB' },
    fcm_token: { type: String, default: null },
    
    addresses: { type: Array, default: [] },

    device_info: { type: Object, default: null },

    otp_code: { type: String, default: null },
    
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date, default: dated },
    updatedAt: { type: Date, default: dated },
});

module.exports = mongoose.model('User', UserSchema);