const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const STATUSES = ['OPEN', 'CLOSE', 'DELETED'];
const dated = new Date();

const CmsSchema = new Schema({
    
    key: {type: String, default: null},
    value: {type: String, default: null},
    status: {type: String, enum: STATUSES, default: 'OPEN'},

    deletedAt: {type: Date, default: null},
    createdAt: {type: Date, default: dated},
    updatedAt: {type: Date, default: dated},
});

module.exports = mongoose.model('Cms', CmsSchema);