const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const STATUSES = ['OPEN', 'CLOSE', 'DELETED'];
const PAYMENT_MODE = ['COD', 'CARD', 'UPI'];
const TRANSACTION_STATUS = ['SUCCESS', 'FAILED', 'PENDING', 'CANCELLED_BY_USER'];
const GENDER = ['MALE', 'FEMALE'];
const COUPON_TYPE = ['FLAT', 'PERCENTAGE'];
const dated = new Date();

const ProductSchema = new Schema({
    user_id: {type: ObjectId, default: null},
    product_id: {type: ObjectId, default: null},
    product_detail: {type: Object, default: null},
    product_price:{type: Number, default: 0},
    qty: {type: Number, default: 1},
    status: {type: String, enum: STATUSES, default: 'OPEN'},
    created_at: {type: Date, default: dated},
    updated_at: {type: Date, default: dated},
    deleted_at: {type: Date, default: null}
});

const PaymentSchema = new Schema({

    razorpay_order_id: { type: String, default: null },
    razorpay_payment_id: { type: String, default: null },
    razorpay_signature: { type: String, default: null },
    
    razorpay_options: { type: Object, default: null },
    razorpay_response: { type: Object, default: null },

    payment_document: { type: Object, default: null },
    
    transaction_id: { type: String, default: null },
    payment_mode: { type: String, enum: PAYMENT_MODE, default: 'CARD' },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },

    order_id: {type: ObjectId, default: null},

    transaction_status: { type: String, enum: TRANSACTION_STATUS, default: 'PENDING' },
    created_at: {type: Date, default: dated},
    updated_at: {type: Date, default: dated},
    deleted_at: {type: Date, default: null}
});

const ShippingAddressSchema = new Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    phone: { type: String, default: null },
    email: { type: String, default: null },

    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    pincode: { type: Number, default: 0 },

    created_at: {type: Date, default: dated},
    updated_at: {type: Date, default: dated},
    deleted_at: {type: Date, default: null}
});

const CustomerDetailSchema = new Schema({
    
    customer_id: {type: ObjectId, default: null},
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, default: null },
    profilePic: { type: String, default: null },
    contact_number: { type: String, default: null },
    gender: { type: String, enum: GENDER, default: 'MALE' },
});

const OrderSchema = new Schema({

    customer_id: {type: ObjectId, default: null},
    customer_details: CustomerDetailSchema,
    products: [ProductSchema],

    payment: PaymentSchema,
    address: ShippingAddressSchema,

    sub_total: { type: Number, default: 0 },

    shipping_charge: { type: Number, default: 0 },

    tax_percentage: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },

    coupon_applied: { type: Boolean, default: false },
    coupon_code: { type: String, default: null },
    coupon_type: { type: String, enum: COUPON_TYPE },
    coupon_discount_percent: { type: Number, default: null },
    coupon_discount_amount: { type: Number, default: 0 },

    grand_total: { type: Number, default: 0 },

    status: {type: String, enum: STATUSES, default: 'OPEN'},
    created_at: {type: Date, default: dated},
    updated_at: {type: Date, default: dated},
    deleted_at: {type: Date, default: null}
});

module.exports = mongoose.model('Order', OrderSchema);