const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

exports.sendMail = async (to, subject, html) => {
    let transport = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        },
    })),
        mailOptions = {
            to,
            subject,
            html
        }
    try {
        await transport.sendMail(mailOptions);
        transport.close();
        console.log(`${to}로 메일 보냄`);
    } catch (error) {
        console.error(`메일 보내기 실패 : ${error}`);
    }
}