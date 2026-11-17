const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => res.render("signin", { user: req.user }));
router.get("/signup", (req, res) => res.render("signup", { user: req.user }));

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Incorrect Email or Password" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await User.create({ fullName, email, password });
    return res.redirect("/user/signin");
  } catch (error) {
    const message =
      error.code === 11000
        ? "An account with this email already exists."
        : "Could not create account. Please fill in all fields.";
    return res.status(400).render("signup", { error: message });
  }
});

module.exports = router;
