const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const STATUSES = ['OPEN', 'CLOSE', 'DELETED'];
const dated = new Date();

const FaqSchema = new Schema({
    
    question: {type: String, default: null},
    answer: {type: String, default: null},
    status: {type: String, enum: STATUSES, default: 'OPEN'},

    deletedAt: {type: Date, default: null},
    createdAt: {type: Date, default: dated},
    updatedAt: {type: Date, default: dated},
});

module.exports = mongoose.model('Faq', FaqSchema);