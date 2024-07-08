require('dotenv').config()

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY});

mg.messages.create('mg.projectrunway.tech', {
    from: 'signup@mg.projectrunway.tech',
    to: ['ja347685@ucf.edu'],
    subject: "test",
    text: "Testing some Mailgun awesomeness!",
    html: "<h1>Testing some Mailgun awesomeness!</h1>"
})
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err)); // logs any error