const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const STATUSES = ['OPEN', 'CLOSE', 'DELETED'];
const dated = new Date();

const CategorySchema = new Schema({
    _id: {type: ObjectId, default: null},
    department_id: {type: ObjectId},
    category_title: {type: String},
    category_slug: {type: String},
    category_image: {type: String, default: null},
    status: {type: String, enum: STATUSES, default: 'OPEN'},
    created_at: {type: Date, default: dated},
    updated_at: {type: Date, default: dated},
    deleted_at: {type: Date, default: null}
});

const DepartmentSchema = new Schema({
    department_title: {type: String, unique: true},
    department_slug: {type: String, unique: true},
    categories: [CategorySchema],
    department_image: {type: String, default: null},
    status: {type: String, enum: STATUSES, default: 'OPEN'},
    created_at: {type: Date, default: dated},
    updated_at: {type: Date, default: dated},
    deleted_at: {type: Date, default: null}
});

module.exports = mongoose.model('Department', DepartmentSchema);