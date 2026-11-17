const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    // URL used by <img>. Either a legacy "/uploads/..." path or "/blog/:id/cover"
    coverImageURL: { type: String, required: false },
    // Vercel's filesystem is read-only, so uploaded covers are stored in MongoDB.
    // select:false keeps the binary out of list queries.
    coverImage: {
      type: new Schema(
        { data: Buffer, contentType: String },
        { _id: false }
      ),
      select: false,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const Blog = model("blog", blogSchema);

module.exports = Blog;
