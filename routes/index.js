const express = require("express");
const router = express.Router();

const UsersRouter = require("./users.js");
const PostsRouter = require("./posts.js");
const CommentsRouter = require("./comments.js");

router.use("/", [UsersRouter]);
router.use("/posts", [PostsRouter]);
router.use("/comments", [CommentsRouter]);

module.exports = router;
