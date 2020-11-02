const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dan.t@live.ie',
        subject: 'Welcome to the app',
        text: `Sup ${name}. Welocme to the task app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dan.t@live.ie',
        subject: 'Bye',
        text: `Bye Bye Bye ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}

// Basic send using sendgrid
// sgMail.send({
//     to: 'dantoher1337@gmail.com',
//     from: 'dan.t@live.ie',
//     subject: 'Test Email from SendGrid',
//     text: 'Work please'
// });