# Blogify — Full-Stack Blog Platform

A full-stack blogging application built with Node.js, Express.js, and MongoDB. Users can sign up, log in, create blog posts with cover images, and comment on posts.

## Features

- **Authentication** — Signup/login with salted password hashing (`crypto.createHmac`) and JWT-based session tokens stored in httpOnly cookies
- **Authorization** — Role-based access control (`USER` / `ADMIN`) baked into the user schema and JWT payload
- **Blog CRUD** — Create and view blog posts with cover image upload via Multer
- **Comments** — Users can comment on blog posts; comments are linked to both the blog and the author
- **Relational data modeling** — Mongoose schema references and `.populate()` used to join user data into blogs and comments
- **Server-side rendering** — EJS templating for dynamic views (home, blog detail, auth pages)

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT (jsonwebtoken), Node's built-in `crypto` module for password hashing
- **File uploads:** Multer
- **Templating:** EJS
- **Other:** cookie-parser, dotenv

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB running locally or a MongoDB Atlas connection string

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/blogify.git
cd blogify

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# then edit .env and fill in your own MONGO_URL and JWT_SECRET
```

### Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```
PORT=8000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret_string
```

### Run the app

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

The app will run on `http://localhost:8000` (or the port set in `.env`).

## Project Structure

```
blogify/
├── middlewares/     # Auth middleware (cookie/JWT verification)
├── models/          # Mongoose schemas (User, Blog, Comment)
├── public/          # Static assets and uploaded images
├── routes/          # Express route handlers
├── services/        # JWT creation/validation logic
├── views/           # EJS templates
└── app.js           # App entry point
```

## Future Improvements

- Add input validation (e.g. express-validator)
- Add edit/delete functionality for blog posts
- Add pagination for the home page blog list
- Improve error handling/feedback on failed auth attempts

## License

ISC
