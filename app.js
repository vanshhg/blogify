require("dotenv").config();

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./lib/db");
const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

// Use __dirname (not process.cwd()) so paths resolve correctly on Vercel.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Make sure the DB is connected before any route that needs it.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/", async (req, res, next) => {
  try {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home", { user: req.user, blogs: allBlogs });
  } catch (err) {
    next(err);
  }
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// 404
app.use((req, res) => {
  res.status(404).render("error", {
    user: req.user,
    message: "Page not found",
  });
});

// Central error handler (Express 4 doesn't catch async errors on its own)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const message =
    err.code === "LIMIT_FILE_SIZE"
      ? "Image is too large (max 2 MB)."
      : "Something went wrong. Please try again.";
  res.status(err.code === "LIMIT_FILE_SIZE" ? 400 : 500).render("error", {
    user: req.user,
    message,
  });
});

// Locally: start a server. On Vercel: just export the app.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
}

module.exports = app;
