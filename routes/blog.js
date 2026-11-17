const { Router } = require("express");
const multer = require("multer");
const mongoose = require("mongoose");

const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { requireAuth } = require("../middlewares/authentication");

const router = Router();

// Memory storage: Vercel functions can't write to the project directory.
// Vercel also limits request bodies to ~4.5 MB, so cap uploads at 2 MB.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
    cb(null, false);
  },
});

router.get("/add-new", requireAuth, (req, res) => {
  return res.render("addBlog", { user: req.user });
});

// Serve a cover image stored in MongoDB
router.get("/:id/cover", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next();
    const blog = await Blog.findById(req.params.id).select("+coverImage");
    if (!blog || !blog.coverImage || !blog.coverImage.data) return next();
    res.set("Content-Type", blog.coverImage.contentType || "image/jpeg");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(blog.coverImage.data);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next();
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    if (!blog) return next();
    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );
    return res.render("blog", { user: req.user, blog, comments });
  } catch (err) {
    next(err);
  }
});

router.post("/comment/:blogId", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.blogId)) return next();
    if (req.body.content && req.body.content.trim()) {
      await Comment.create({
        content: req.body.content.trim(),
        blogId: req.params.blogId,
        createdBy: req.user._id,
      });
    }
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, upload.single("coverImage"), async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const blog = new Blog({ title, body, createdBy: req.user._id });

    if (req.file) {
      blog.coverImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      blog.coverImageURL = `/blog/${blog._id}/cover`;
    }

    await blog.save();
    return res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .render("addBlog", { user: req.user, error: "Title and body are required." });
    }
    next(err);
  }
});

module.exports = router;
