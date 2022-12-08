const express = require("express");
const { Posts, Postslikes, sequelize } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

// 게시글 작성 API
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const { userId, nickname } = res.locals.user;

        if (req.body == 0) {
            return res.status(400).json({
                success: false,
                errorMessage: "데이터 형식이 올바르지 않습니다.",
            });
        }
        await Posts.create({ userId, nickname, title, content });
        res.status(200).json({ message: "게시글 작성에 성공하였습니다." });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            errorMessage: "데이터 형식이 올바르지 않습니다.",
        });
    }
});

// 게시글 조회 API
router.get("/", async (req, res) => {
    try {
        const data = await Posts.findAll({
            attributes: { exclude: ["content"] },
            order: [["createdAt", "DESC"]],
        });
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});

// 게시글 상세 조회 API
router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const existPosts = await Posts.findOne({ where: { postId } });
        if (!existPosts) {
            return res.status(400).json({
                success: false,
                errorMessage: "게시글이 존재하지 않습니다.",
            });
        }
        res.json({ data: existPosts });
    } catch (error) {
        console.error(error);
        res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});

// 게시글 수정 API
router.put("/:postId", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, content } = req.body;
        const existsPosts = await Posts.findOne({ postId });

        if (existsPosts) {
            await Posts.update({ title, content }, { where: { postId } });
            return res
                .status(200)
                .json({ message: "게시글을 수정하였습니다." });
        } else {
            ``;
            res.status(400).json({
                errorMessage: "게시글이 존재하지 않습니다.",
            });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ errorMessage: "게시글 수정에 실패하였습니다." });
    }
});

// 게시글 삭제 API
router.delete("/:postId", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const existsPosts = await Posts.findByPk(postId);
        if (existsPosts) {
            await Posts.destroy({ where: { postId } });
            res.status(200).json({ message: "게시글을 삭제하였습니다." });
        } else {
            res.status(400).json({
                errorMessage: "게시글이 존재하지 않습니다.",
            });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ errorMessage: "게시글 삭제에 실패하였습니다." });
    }
});

// 게시글 좋아요 API
router.post("/:postId/like", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.body;
        const { userId } = res.locals.userId;

        const currentLike = await Postslikes.findOne({
            where: [{ postId }, { userId }],
        });

        if (!currentLike) {
            await Postslikes.create({ postId, userId });
            await Posts.increment({ likes: 1 }, { where: { postId } });
            res.status(200).json({
                message: "게시글의 좋아요를 등록하였습니다.",
            });
        } else {
            await Postslikes.destroy({ where: [{ postId }, { userId }] });
            await Posts.decrement({ likes: 1 }, { where: { postId } });
            res.status(200).json({
                message: "게시글의 좋아요를 취소하였습니다.",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            errorMessage: "게시글 좋아요에 실패하였습니다.",
        });
    }
});

// 좋아요 게시글 조회 API
router.get("/like", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const [arr] = await sequelize.query(
        "SELECT * FROM posts JOIN Postlikes ON Postlikes.postId = Posts.postId"
    );
    const likePosts = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].userId === userId) {
            likePosts.push(arr[i]);
        }
    }
    res.json({ likePosts });
});

module.exports = router;
