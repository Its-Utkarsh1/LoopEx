require("dotenv").config();
const JWT = require("jsonwebtoken");
const secret = "$Dev-Utkarhs$";

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        year: user.year,
        role: user.role,
    }

    const token = JWT.sign(payload,secret,{expiresIn: "1d"});

    return token;
}
function validateToken(token) {
    try {
        const payload = JWT.verify(token, secret);
        return payload;
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            console.error("❌ Token expired");
        } else {
            console.error("❌ Invalid token:", err.message);
        }
        return null;
    }
}


module.exports = {
    createTokenForUser,
    validateToken,
};