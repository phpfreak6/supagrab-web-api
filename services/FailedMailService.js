const FailedMailModel = require('../models').FailedMailModel;
const {ObjectId} = require('mongodb');

module.exports = class FailedMailService {

    constructor() {}

    async insertFailedMail(dataObj) {
        try {
            let result = await FailedMailModel.create(dataObj);
            return result;
        } catch (ex) {
            throw ex;
        }
    }

};