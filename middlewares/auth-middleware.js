const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
    console.log(req.cookies);
    const { accessToken } = req.cookies;

    if (!accessToken) {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
        return;
    }

    try {
        const { userId } = jwt.verify(accessToken, "sparta_secret");

        await Users.findByPk(userId).then((user) => {
            console.log(user);
            res.locals.user = user;

            next();
        });
    } catch (err) {
        console.log(err);
        res.status(401).send({
            errorMessage: "인증에 실패했습니다.",
        });
    }
};
