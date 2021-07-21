require('dotenv').config();
const nodemailer = require('nodemailer');
let $this;

module.exports = class MailService {

    transporter;

    constructor() {
        $this = this;
        $this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }

    sendMail(mailOptionsObj) {
        try {
            mailOptionsObj.from = process.env.MAIL_USERNAME;
            return new Promise((resolve, reject) => {
                $this.transporter.sendMail(mailOptionsObj, function (error, info) {
                    if (error) {
                        resolve({sent: false, msg: error.response, obj: error, data: mailOptionsObj});
                    } else {
                        resolve({sent: true, msg: info.response, obj: info});
                    }
                });
            });
        } catch (ex) {
            throw ex;
        }

    }
};