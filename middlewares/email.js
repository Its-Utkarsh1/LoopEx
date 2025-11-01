const { transporter } = require("./emailConfig");

const sendVerificationCode = async (email, verificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: `"CamConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your Email",
            text: `Your verification code is ${verificationCode}`,
            html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
        });
        console.log("Email sent successfully:", response.messageId);
    } catch (error) {
        console.error("Email sending error:", error);
        throw new Error("Failed to send verification code");
    }
};

module.exports = { sendVerificationCode };
