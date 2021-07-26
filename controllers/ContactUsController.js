const Validator = require('validatorjs');
const view = require('ejs');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const FailedMailService = require('../services').FailedMailService;
const FailedMailServiceObj = new FailedMailService();

const MailService = require('../services').MailService;
const MailServiceObj = new MailService();

var {VIEW_PATH, ADMIN_EMAIL} = require('../config/config');

module.exports = class ContactUsController {

    constructor() { }

    async contact(req, res, next) {
        try {
            let data = req.body;
            let rules = {first_name: 'required', email: 'required|email', message: 'required'};
            let validation = new Validator(data, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            /* SEND MAIL TO ADMIN */
            let admin_email_html = await view.renderFile(VIEW_PATH + '/emails/contact-us-admin-mail.ejs', data);
            MailServiceObj.sendMail({to: ADMIN_EMAIL, html: admin_email_html, subject: 'New Query'}).then(async (result) => {
                if (result.sent == false) {
                    console.log('Contact Us Admin Email Failed');
                    await FailedMailServiceObj.insertFailedMail({email: result.data.to, data: result.data, type: 'CONTACT_US_ADMIN'});
                }
            }).catch(async (ex) => {
                console.log(ex);
            });

            /* THANKYOU MAIL TO ENQUIRER */
            let customer_thankyou_html = await view.renderFile(VIEW_PATH + '/emails/customer-contact-thankyou-mail.ejs', data);
            MailServiceObj.sendMail({to: data.email, html: customer_thankyou_html, subject: 'Thankyou For Writing To Us'}).then(async (result) => {
                if (result.sent == false) {
                    console.log('Customer Thankyou Mail Failed');
                    await FailedMailServiceObj.insertFailedMail({email: result.data.to, data: result.data, type: 'CONTACT_US_ENQUIRER'});
                }
            }).catch(async (ex) => {
                console.log(ex);
            });

            return await responseServiceObj.sendResponse(res, {
                msg: 'Thankyou for writing to us. We will come back to you shortly.'
            });

        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }
};