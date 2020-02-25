const express = require("express");
const router = express.Router();
const getConnection = require("../mysqlConnection");
const { host, port } = require("../server.config");
const { Jwts, Jwtt } = require("../jwt");

router.post("/login", (req, res) => {
    //变量的结构
    //获取用户登录时候传过来的参数
    const { username, password } = req.body;
    const token = Jwts({ username, password });
    console.log(req.body, token);
    const sql = `SELECT * FROM base_user where username='${username}' and password='${password}'`;
    const db = getConnection();
    db.connect();
    db.query(sql, (err, sqlres) => {
        if (err) {
            console.log(err.message);
            res.send(err.message)
        }
        else {
            const sqldata = sqlres[0];
            console.log(sqlres);

            if (sqldata) {
                res.send({
                    code: "200",
                    err: "ok",
                    data: sqldata,
                    token
                })
            }
            else {
                res.send({
                    code: "201",
                    err: "密码或者登录名错误！"
                })
            }
        }
    })
    db.end();
})

//token验证接口
router.post("/auth", (req, res) => {
    console.log(`「授权接口」 被调用！`);
    let token = req.headers.authorization;
    console.log(token);
    const Jwttres = Jwtt(token)
    if (Jwttres === 1) {
        console.log("token已过期");
        res.send({
            code: 409,
            err: "err",
            message: "token已过期"
        })
    }
    else {
        res.send({
            code: 200,
            err: "ok",
            message: "没过期"
        })
    }
})
module.exports = router;