const express = require('express');
const User = require('../models/User');
const { sendVerificationCode } = require("../middlewares/email");


async function handleUserRegister(req, res) {
    try {
        const { firstName, lastName, email, studentId, university, major, year, password, role } = req.body;

        // Validate the input
        if (!firstName || !lastName || !email || !studentId || !university || !major || !year || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Create a new user
        await User.create({
            firstName,
            lastName,
            email,
            studentId,
            university,
            major,
            year,
            password,
            role
        });

        // Redirect to login page after successful registration
        return res.redirect("/login");

    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;

        //Validate the input
        if (!email || !password) {
            return res.render("login", { error: "All fields are required" });
        }

        const result = await User.matchPasswordAndGenerateToken(email, password);
        console.log("Login result:", result);

        const { token } = result;
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            //no maxAge or expires for session cookie
        });
        return res.redirect("/");
    } catch (error) {
        console.log("Error during user login: ", error);
        return res.render("login", { title: "Login Page", error: error.message });
    }
}


function handleUserLogout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false, // set true if using HTTPS
        sameSite: "lax"
    });

    // Redirect user to homepage or login page
    res.redirect("/");
}

async function handleForgetPassword(req, res) {
    try {
        let { email } = req.body;

        if (!email || typeof email !== "string") {
            return res.render("forgetPassword", { error: "Please enter a valid email address.", message: null });
        }

        email = email.trim().toLowerCase();

        const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if (!user) {
            return res.render("forgetPassword", { error: "User not found.", message: null });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // expires in 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP via email
        await sendVerificationCode(user.email, otp);

        // Store email in cookie for verification step
        res.cookie("otpEmail", email, { maxAge: 5 * 60 * 1000, httpOnly: true, sameSite: "strict" });

        // Render verify OTP page
        return res.render("verifyOtp", { error: null, message: "An OTP has been sent to your email." });

    } catch (error) {
        console.error("Password Reset Error:", error);
        return res.render("forgetPassword", { error: "Failed to process request. Try again.", message: null });
    }
}
 
// STEP 2: VERIFY OTP
async function handleVerifyOtp(req, res) {
    try {
        const { otp } = req.body;
        const email = req.cookies.otpEmail;

        if (!email) {
            return res.render("forgetPassword", { error: "Session expired. Request a new OTP." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.render("forgetPassword", { error: "User not found." });
        }

        if (user.otp !== otp) {
            return res.render("verifyOtp", { error: "Invalid OTP. Try again." });
        }

        if (Date.now() > user.otpExpires) {
            return res.render("verifyOtp", { error: "OTP expired. Request a new one." });
        }

        // OTP is valid, render page to reset password
        return res.render("resetPassword", {error: null });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.render("verifyOtp", { error: "Failed to verify OTP. Try again." });
    }
}

// STEP 3: RESET PASSWORD
async function handleResetPassword(req, res) {
    try {
        const { newPassword } = req.body;
        const email = req.cookies.otpEmail;

        if (!email) {
            return res.render("forgetPassword", { error: "Session expired. Request a new OTP." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.render("forgetPassword", { error: "User not found." });
        }

        // Reset password
        user.password = newPassword; // hashed by pre-save middleware
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.clearCookie("otpEmail");
        return res.render("login", { message: "Password reset successfully. Please log in." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.render("resetPassword", { error: "Failed to reset password. Try again." });
    }
}
module.exports = { handleUserLogin, handleUserLogout, handleUserRegister, handleVerifyOtp, handleForgetPassword, handleResetPassword };