const mongoose = require("mongoose");
const { randomBytes, createHmac } = require('crypto');
const { createTokenForUser } = require("../service/authentication");
const userSchema = new mongoose.Schema({

    firstName: { type: String, required: true, },
    lastName: { type: String, required: true, },
    email: { type: String, required: true, },
    studentId: { type: Number, required: true, },
    university: { type: String, required: true, },
    major: { type: String, required: true, },
    year: { type: Number, required: true, },
    password: { type: String, required: true, },
    role: { type: String, enum: ["Student", "Admin"], default: "Student" },
    salt: { type: String, },
    otp: String,
    otpExpires: Date,
}, { timestamps: true });

//Hash password before saveing in DB

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex");
    this.salt = salt;

    this.password = createHmac("sha256", salt).update(this.password).digest("hex");
    next();
});

//Match password and Generate Token
userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const userHashedPassword = createHmac("sha256", user.salt).update(password).digest("hex");

    if (user.password !== userHashedPassword) throw new Error("Invalid password");

    //Generate Token
    const token = createTokenForUser(user);
    return { user, token };
}

const User = mongoose.model('User', userSchema);

module.exports = User; 