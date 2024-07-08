require('dotenv').config()

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

function sendVerificationEmail(code, recipient) {
    mg.messages.create('mg.projectrunway.tech', {
        from: 'signup@mg.projectrunway.tech',
        to: [recipient],
        subject: "Please verify your Runway account",
        text: `Your verification code is ${code}`,
    })
        .then(msg => console.log(msg)) // logs response data
        .catch(err => console.log(err)); // logs any error
}

module.exports = {
    sendVerificationEmail,
};