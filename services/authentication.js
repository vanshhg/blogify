const JWT = require("jsonwebtoken");

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return secret;
}

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  return JWT.sign(payload, getSecret(), { expiresIn: "7d" });
}

function validateToken(token) {
  return JWT.verify(token, getSecret());
}

module.exports = { createTokenForUser, validateToken };
