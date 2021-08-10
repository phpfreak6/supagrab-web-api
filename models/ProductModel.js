const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const STATUSES = ['OPEN', 'CLOSE', 'DELETED'];
const dated = new Date();

const TabSchema = new Schema({
    _id: {type: ObjectId, default: null},

    tab_name: { type:String },
    tab_value: { type: String },

    status: {type: String, enum: STATUSES, default: 'OPEN'},

    deletedAt: {type: Date, default: null},
    createdAt: {type: Date, default: dated},
    updatedAt: {type: Date, default: dated},
});

const AttributeSchema = new Schema({
    _id: {type: ObjectId, default: null},
    
    tabs: [TabSchema],

    status: {type: String, enum: STATUSES, default: 'OPEN'},

    deletedAt: {type: Date, default: null},
    createdAt: {type: Date, default: dated},
    updatedAt: {type: Date, default: dated},
});

const ReviewsSchema = new Schema({
    _id: {type: ObjectId, default: null},
    
    first_name: {type: String},
    last_name: {type: String},

    profile_pic: {type: String},

    comment: {type: String},

    likes_cnt: {type: Number},
    dislikes_cnt: {type: Number},

    status: {type: String, enum: STATUSES, default: 'OPEN'},

    deletedAt: {type: Date, default: null},
    createdAt: {type: Date, default: dated},
    updatedAt: {type: Date, default: dated},
});

const ImagesSchema = new Schema({
    url: {type: String},
    default: {type: Boolean}
});

const ProductImageSchema = new Schema({
    _id: {type: ObjectId, default: null},
    
    product_id: {type: ObjectId, default: null},
    urls: [ImagesSchema],
    
    status: {type: String, enum: STATUSES, default: 'OPEN'},

    deletedAt: {type: Date, default: null},
    createdAt: {type: Date, default: dated},
    updatedAt: {type: Date, default: dated},
});

const ProductSchema = new Schema({
    
    department_id: {type: ObjectId, default: null},
    category_id: {type: ObjectId, default: null},
    
    product_title: {type: String},
    product_slug: {type: String, unique: true},

    attributes: [AttributeSchema],

    reviews: [ReviewsSchema],

    images: [ProductImageSchema],

    status: {type: String, enum: STATUSES, default: 'OPEN'},

    deletedAt: {type: Date, default: null},
    createdAt: {type: Date, default: dated},
    updatedAt: {type: Date, default: dated},
});

module.exports = mongoose.model('Product', ProductSchema);