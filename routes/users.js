const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const re_nickname = /^[a-zA-Z0-9]{3,10}$/;
const re_password = /^[a-zA-Z0-9]{4,30}$/;

const userSchema = Joi.object({
    nickname: Joi.string().pattern(re_nickname).required(),
    password: Joi.string().pattern(re_password).required(),
    confirm: Joi.string(),
});

function isRegexValidation(target, regex) {
    return target.search(regex) !== -1;
}

// 회원가입 API
router.post("/signup", async (req, res) => {
    const { nickname, password, confirm } = await userSchema.validateAsync(
        req.body
    );
    if (password !== confirm) {
        res.status(400).json({
            errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
        });
        return;
    }
    try {
        const existsUsers = await Users.findOne({ where: { nickname } });
        if (existsUsers) {
            // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다.
            //  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
            res.status(400).json({
                errorMessage: "중복된 닉네임입니다.",
            });
            return;
        }
        if (nickname.search(re_nickname) === -1) {
            return res.status(412).send({
                errorMessage: "ID의 형식이 일치하지 않습니다.",
            });
        }
        if (password.search(re_password) === -1) {
            return res.status(412).send({
                errorMessage: "패스워드 형식이 일치하지 않습니다.",
            });
        }
        if (isRegexValidation(password, nickname)) {
            return res.status(412).send({
                errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
            });
        }

        await Users.create({ nickname, password });
        res.status(201).json({
            message: "회원가입이 정상적으로 완료 되었습니다.",
        });
    } catch (error) {
        // nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
        console.error(error);
        res.status(400).json({ errorMessage: "회원 가입에 실패하였습니다." });
    }
});

function createAccessToken(userId) {
    const accessToken = jwt.sign({ userId: userId }, "sparta_secret", {
        expiresIn: "15m",
    });
    return accessToken;
}

// 로그인 API
router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;
    const user = await Users.findOne({ where: { nickname } });

    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    if (!user || password !== user.password) {
        res.status(400).send({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
        });
        return;
    }
    const accessToken = createAccessToken(user.userId);
    res.cookie("accessToken", accessToken);
    return res
        .status(200)
        .json({ message: "Token이 정상적으로 발급되었습니다." });
});

module.exports = router;
