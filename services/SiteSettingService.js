const SiteSettingModel = require('../models').SiteSettingModel;
const {ObjectId} = require('mongodb');

module.exports = class SiteSettingService {

    constructor() {

    }

    async getSiteSettings() {
        try {
            return await SiteSettingModel.find({});
        } catch (ex) {
            throw ex;
        }

    }

    async insertOrUpdateSiteSetting(dataObj) {
        try {
            let result = await SiteSettingModel.update({site_setting_key: dataObj.site_setting_key}, dataObj, {upsert: true});
            if (result) {
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        }
    }

};