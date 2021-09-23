const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const STATUSES = ['OPEN', 'CLOSE', 'DELETED'];
const COUPON_TYPE = ['FLAT', 'PERCENTAGE'];
const dated = new Date();

const CouponSchema = new Schema({
    
    coupon_title: { type: String },
    coupon_code: { type: String, unique: true },
    coupon_description: { type: String },

    coupon_max_uses: { type: Number },
    coupon_uses_yet: { type: Number },

    coupon_type: { type: String, enum: COUPON_TYPE },
    discount_amount: { type: Number, default: 0 },

    opened_at: { type: Date, default: null },
    expired_at: { type: Date, default: null },

    status: {type: String, enum: STATUSES, default: 'OPEN'},

    deletedAt: {type: Date, default: null},
    createdAt: {type: Date, default: dated},
    updatedAt: {type: Date, default: dated},
});

module.exports = mongoose.model('Coupon', CouponSchema);