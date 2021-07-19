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
            NewsLetterSubscriptionService.checkNewsletterEmailExists(dataObj.email);
        } catch (ex) {

        }

    }
};