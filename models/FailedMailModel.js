const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const EMAIL_TYPE = ['NEWSLETTER', 'CONTACT_US_ADMIN','CONTACT_US_ENQUIRER'];
const dated = new Date();

const FailedEmailSchema = new Schema({
    email: {type: String, default: null},
    cc: {type: String, default: null},
    bcc: {type: String, default: null},
    attachment: {type: Array, default: null},
    data: {type: Object, default: null},
    type: {type: String, enum: EMAIL_TYPE},
    created_at: {type: Date, default: dated},
    updated_at: {type: Date, default: dated}
});

module.exports = mongoose.model('FailedEmail', FailedEmailSchema);