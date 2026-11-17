const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) return next();

    try {
      req.user = validateToken(tokenCookieValue);
    } catch (error) {
      // invalid/expired token: treat as logged out
    }
    return next();
  };
}

function requireAuth(req, res, next) {
  if (!req.user) return res.redirect("/user/signin");
  return next();
}

module.exports = { checkForAuthenticationCookie, requireAuth };
