const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const STATUSES = ['OPEN', 'CLOSE', 'DELETED'];
const dated = new Date();

const SiteSettingSchema = new Schema({
    site_setting_key: {type: String, default: null},
    value: {type: String, default: null},
    status: {type: String, enum: STATUSES, default: 'OPEN'},
    created_at: {type: Date, default: dated},
    updated_at: {type: Date, default: dated}
});

module.exports = mongoose.model('SiteSettings', SiteSettingSchema);