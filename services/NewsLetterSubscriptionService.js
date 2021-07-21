const NewsletterSubscriptionModel = require('../models').NewsletterSubscriptionModel;
const {ObjectId} = require('mongodb');
const view = require('ejs');
const MailService = require('./MailService');
const MailServiceObj = new MailService();
var {VIEW_PATH, basePath} = require('../config/config');

module.exports = class NewsletterSubscriptionService {

    constructor() {

    }

    async updateNewsLetter(in_newsletter_id, dataObj) {
        let newsletter_id = ObjectId(in_newsletter_id);
        try {
            await NewsletterSubscriptionModel.findByIdAndUpdate(newsletter_id, dataObj);
            return true;
        } catch (ex) {
            throw ex;
        }
    }

    async checkNewsletterEmailExists(email) {
        try {
            let newsLetterObj = await NewsletterSubscriptionModel.findOne({email: email});
            if (newsLetterObj) {
                return newsLetterObj;
            }
            return false;
        } catch (ex) {
            throw ex;
        }
    }

    async sendSubscriptionVerifyEmail(email) {
        try {
            let encrypted_string = Buffer.from(email + '-' + (+new Date())).toString('base64');
            let dataObj = {};
            dataObj.email = email;
            dataObj.encrypted_string = encrypted_string;
            dataObj.basePath = basePath;
            let html = await view.renderFile(VIEW_PATH + '/emails/newsletter-verification.ejs', dataObj);
            const mailData = {to: email, html: html, subject: 'Verify Supagrab Newsletter'};
            return await MailServiceObj.sendMail(mailData);
        } catch (ex) {
            throw ex;
        }

    }

    async insertNewsletter(dataObj) {
        try {
            let result = await NewsletterSubscriptionModel.create(dataObj);
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