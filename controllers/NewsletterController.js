const Validator = require('validatorjs');
const {ObjectId} = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const NewsLetterSubscriptionService = require('../services').NewsLetterSubscriptionService;
const NewsLetterSubscriptionServiceObj = new NewsLetterSubscriptionService();


module.exports = class NewsletterController {

    constructor() {

    }

    async subscribe(req, res, next) {
        try {
            let dataObj = req.body;
            let rules = {email: 'required|email'};
            let validation = new Validator(dataObj, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            NewsLetterSubscriptionServiceObj.sendSubscriptionVerifyEmail(dataObj.email)
                    .then(async (result) => {
                        if (result.sent == false) {
                            console.log('failed', result);
                        }
                    })
                    .catch(async (ex) => {
                        return await responseServiceObj.sendException(res, {msg: ex.toString()});
                    });
            return await responseServiceObj.sendResponse(res, {
                msg: 'Verification Mail Sent Successfully'
            });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }

    }
};