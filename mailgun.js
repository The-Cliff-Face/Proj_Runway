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

// email the 4-digit code to the email provided upon signup
// do it in line 111 of server.js
// create an input box for the code and just wait until the user enters the code.
// if the code is an error, just stay on that particular page
// if the code is successful, then redirect to gallery page, 
// set the user's verified status to true

module.exports = {
    sendVerificationEmail,
};