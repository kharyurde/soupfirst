nodemailer = require('nodemailer');


async function sendEmail(userEmail, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: userEmail,
        subject: 'SoupMe Verification Code',
        html: `<h1>SoupMe Email Verification</h1>
                <p>Your verification code is:</p>
                <h2 style="color:blue;">${message}</h2>
                <p>Please enter this code on the verification page to complete your registration process.</p>
                <p>If you did not request this email, please ignore it.</p>
                <br>
                <p>Best regards,</p>
                <p>Soupie Nigeria</p>
                <p>Contact Information: Phone: +1234567890 | Email: soupieng@gmail.com</p>`
    };
    

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification mail sent: ");
    } catch (error) {
        console.log('Email sending failed with an error:', error);
    }
}
module.exports = sendEmail