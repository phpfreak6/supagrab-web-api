const UserModel = require('../models').NewsletterSubscriptionModel;
const {ObjectId} = require('mongodb');
const view = require('ejs');
const MailService = require('./MailService');
const MailServiceObj = new MailService();
var {VIEW_PATH, basePath} = require('../config/config');

module.exports = class NewsletterSubscriptionService {

    constructor() {

    }

    async checkNewsletterEmailExists(email) {
        console.log('we are here');
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
};