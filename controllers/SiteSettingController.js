const Validator = require('validatorjs');
const {ObjectId} = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const SiteSettingService = require('../services').SiteSettingService;
const SiteSettingServiceObj = new SiteSettingService();

module.exports = class SiteSettingController {

    constructor() {

    }

    getSiteSettings(req, res, next) {
        try {
            SiteSettingServiceObj.getSiteSettings()
                    .then(async(result) => {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Site Settings Fetched Successfully',
                            data: {
                                site_settings: result
                            }
                        });
                    })
                    .catch(async (ex) => {
                        return await responseServiceObj.sendException(res, {msg: ex.toString()});
                    });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    updateSiteSetting(req, res, next) {
        try {
            let site_setting_key = req.params.site_setting_key;
            let value = req.body.value;
            let status = req.body.status;
            let dataObj = {site_setting_key: site_setting_key, value: value, status: status};
            let validation = new Validator(dataObj, {site_setting_key: 'required', value: 'required', status: 'required|in:OPEN,CLOSE,DELETED'});
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            SiteSettingServiceObj.insertOrUpdateSiteSetting(dataObj)
                    .then(async(result) => {
                        if (result) {
                            return await responseServiceObj.sendResponse(res, {
                                msg: 'Site Setting Saved Successfully',
                                data: {
                                    site_settings: await SiteSettingServiceObj.getSiteSettings()
                                }
                            });
                        } else {
                            throw 'Site Setting Updation Failed';
                        }
                    })
                    .catch(async (ex) => {
                        return await responseServiceObj.sendException(res, {msg: ex.toString()});
                    });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }

    }

    getSiteSettingByKey(req, res, next) {
        try {
            let site_setting_key = req.params.site_setting_key;
            SiteSettingServiceObj.getSiteSettingByKey(site_setting_key)
                    .then(async(result) => {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Site Setting Fetched Successfully',
                            data: {
                                site_setting: result
                            }
                        });
                    })
                    .catch(async (ex) => {
                        return await responseServiceObj.sendException(res, {msg: ex.toString()});
                    });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }
};