const { validateToken } = require('../service/authentication');
const User = require('../models/User');

async function checkForAuthentication(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.locals.user = null;
    req.user = null;
    return next(); // ✅ Important: stop here if no token
  }

  try {
    console.log("✅ Token found, validating...");
    const payload = await validateToken(token);
    console.log("🔍 Token payload:", payload);

    const user = await User.findById(payload._id);
    console.log("👤 User found:", user ? user.email : "Not found");

    res.locals.user = user;
    req.user = user;
  } catch (err) {
    console.error("Auth error:", err);
    res.locals.user = null;
    req.user = null;
  }

  next();
}

function setUserInLocals(req, res, next) {
  res.locals.user = req.user || null;
  next();
}

module.exports = {
  checkForAuthentication,
  setUserInLocals,
};
