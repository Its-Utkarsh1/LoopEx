const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use TLS on port 587
    auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS, // from .env (Gmail App Password)
    },
});

// Function to send verification code / OTP
const sendVerificationCode = async (to, code) => {
    try {
        const info = await transporter.sendMail({
            from: `"CamConnect" <${process.env.EMAIL_USER}>`, // sender name changed
            to,
            subject: "Verify your Email",
            text: `Your verification code is ${code}`,
            html: `<p>Your verification code is: <strong>${code}</strong></p>`,
        });
        console.log("Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification code");
    }
};

module.exports = { transporter, sendVerificationCode };
