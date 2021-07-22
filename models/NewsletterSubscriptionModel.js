const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const STATUSES = ['OPEN', 'CLOSE'];
const dated = new Date();


const NewsletterSubscriptionSchema = new Schema({

    user_id: {type: ObjectId, default: null},

    email: {type: String, default: null},

    status: {type: String, enum: STATUSES, default: 'CLOSE'},

    created_at: {type: Date, default: dated},

    updated_at: {type: Date, default: dated}

});

module.exports = mongoose.model('NewsletterSubscriptions', NewsletterSubscriptionSchema);