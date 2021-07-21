const Validator = require('validatorjs');
const {ObjectId} = require('mongodb');
const moment = require('moment');
const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const NewsLetterSubscriptionService = require('../services').NewsLetterSubscriptionService;
const NewsLetterSubscriptionServiceObj = new NewsLetterSubscriptionService();

const FailedMailService = require('../services').FailedMailService;
const FailedMailServiceObj = new FailedMailService();

var {NEWSLETTER_LINK_EXPIRY_DAYS} = require('../config/config');


module.exports = class NewsletterController {

    constructor() {

    }

    subscribe(req, res, next) {
        try {
            let dataObj = req.body;
            let rules = {email: 'required|email'};
            let validation = new Validator(dataObj, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            NewsLetterSubscriptionServiceObj.checkNewsletterEmailExists(dataObj.email)
                    .then(async (result) => {
                        if (result) {
                            if (result.status == 'CLOSE') {
                                await NewsLetterSubscriptionServiceObj.updateNewsLetter(result._id, {status: 'OPEN'});
                                return await responseServiceObj.sendResponse(res, {
                                    msg: 'Newsletter Subscribed Successfully'
                                });
                            } else if (result.status == 'OPEN') {
                                return await responseServiceObj.sendResponse(res, {
                                    msg: 'You are already subscribed to Supagrab Newsletters'
                                });
                            }
                        } else {
                            NewsLetterSubscriptionServiceObj.sendSubscriptionVerifyEmail(dataObj.email)
                                    .then(async (result) => {
                                        if (result.sent == false) {
                                            console.log('Newsletter Email Failed');
                                            FailedMailServiceObj.insertFailedMail({
                                                email: result.data.to,
                                                data: result.data,
                                                type: 'NEWSLETTER'
                                            });
                                        }
                                    })
                                    .catch(async (ex) => {
                                        return await responseServiceObj.sendException(res, {msg: ex.toString()});
                                    });

                            return await responseServiceObj.sendResponse(res, {
                                msg: 'Verification Mail Sent Successfully'
                            });
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

    verify(req, res, next) {
        try {
            let encrypted_string = req.params.encrypted_string;
            let decrypted_string = Buffer.from(encrypted_string, 'base64').toString('ascii');
            let email = decrypted_string.split('-')[0];
            let timestamp = decrypted_string.split('-')[1];
            let shouldBeTimestamp = moment.unix(timestamp / 1000).add(NEWSLETTER_LINK_EXPIRY_DAYS, 'days').unix();
            if (shouldBeTimestamp >= moment().unix()) {
                NewsLetterSubscriptionServiceObj.checkNewsletterEmailExists(email)
                        .then(async (result) => {
                            if (result) {
                                if (result.status == 'CLOSE') {
                                    await NewsLetterSubscriptionServiceObj.updateNewsLetter(result._id, {status: 'OPEN'});
                                    res.render('newsletter/welcome', {status: true});
                                } else {
                                    res.render('newsletter/welcome', {status: true});
                                }
                            } else {
                                await NewsLetterSubscriptionServiceObj.insertNewsletter({email: email, status: 'OPEN'});
                                res.render('newsletter/welcome', {status: true});
                            }
                        })
                        .catch((ex) => {
                            res.render('newsletter/welcome', {status: false, message: ex.toString()});
                        });
            } else {
                res.render('newsletter/welcome', {status: false, message: 'Link Expired'});
            }
        } catch (ex) {
            res.render('newsletter/welcome', {status: false, message: ex.toString()});
        }
    }
};