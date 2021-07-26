const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const STATUSES = ['OPEN', 'CLOSE', 'DELETED'];
const dated = new Date();

const CategorySchema = new Schema({
    _id: {type: ObjectId, default: null},
    department_id: {type: ObjectId, default: null},
    title: {type: String, default: null},
    image: {type: String, default: null},
    status: {type: String, enum: STATUSES, default: 'OPEN'},
    created_at: {type: Date, default: dated},
    updated_at: {type: Date, default: dated},
    deleted_at: {type: Date, default: null}
});


const DepartmentSchema = new Schema({
    title: {type: String, default: null},
    categories: [CategorySchema],
    image: {type: String, default: null},
    status: {type: String, enum: STATUSES, default: 'OPEN'},
    created_at: {type: Date, default: dated},
    updated_at: {type: Date, default: dated},
    deleted_at: {type: Date, default: null}
});

module.exports = mongoose.model('Department', DepartmentSchema);