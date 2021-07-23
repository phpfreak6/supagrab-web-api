const SiteSettingModel = require('../models').SiteSettingModel;
const {ObjectId} = require('mongodb');

module.exports = class SiteSettingService {

    constructor() {

    }

    async getSiteSettingByKey(site_setting_key) {
        try {
            return await SiteSettingModel.findOne({site_setting_key: site_setting_key, status: {$ne: 'DELETED'}});
        } catch (ex) {
            throw ex;
        }
    }

    async getSiteSettings() {
        try {
            return await SiteSettingModel.find({status: {$ne: 'DELETED'}});
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