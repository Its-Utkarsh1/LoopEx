const express = require("express");
const router = express.Router();

const { handleUserLogin, handleUserLogout, handleUserRegister,  handleForgetPassword, handleVerifyOtp, handleResetPassword, } = require("../controller/user");


//---------User Action------------
router.post("/login",handleUserLogin);
router.post("/logout",handleUserLogout);
router.post("/register",handleUserRegister);
router.post("/forgetPassword",handleForgetPassword);
router.post("/verifyOtp", handleVerifyOtp);
router.post("/resetPassword", handleResetPassword);

module.exports = router;