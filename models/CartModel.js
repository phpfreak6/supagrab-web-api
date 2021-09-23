const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const STATUSES = ['OPEN', 'CLOSE', 'DELETED'];
const dated = new Date();

const CartSchema = new Schema({
    
    user_id: {type: ObjectId, default: null},

    product_id: {type: ObjectId, default: null},
    product_detail: {type: Object, default: null},

    product_price:{type: Number, default: 0},
    qty: {type: Number, default: 1},

    status: {type: String, enum: STATUSES, default: 'OPEN'},

    deletedAt: {type: Date, default: null},
    createdAt: {type: Date, default: dated},
    updatedAt: {type: Date, default: dated},
});

module.exports = mongoose.model('Cart', CartSchema);