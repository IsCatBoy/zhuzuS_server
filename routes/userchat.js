const express = require("express");
const router = express.Router();
const getConnection = require("../mysqlConnection");
const { host, port } = require("../server.config");


// 首页de
router.get("/getchats", (req, res) => {
    //get亲求的参数获取
    console.log(req.query);
    let { id } = req.query;
    //创建查询语句
    let sql = `select * from res_concern where create_user_id=${id} and concern_status=1 and news_satus=1`;
    const db = getConnection();
    db.connect();

    db.query(sql, (err, sqlRes) => {
        if (err) {
            console.log(err.message);
            res.send({
                code: "201",
                err: "服务器有问题了",
                data: err.message
            });
        }
        else {
            if (sqlRes) {
                res.send({
                    code: "200",
                    err: "ok",
                    data: sqlRes
                });
            }
        }
    })
    db.end()
})
// 首页de
router.get("/getchatNew", (req, res) => {
    //get亲求的参数获取
    console.log(req.query);
    let { type } = req.query;
    //创建查询语句
    let sql = ``;
    const db = getConnection();
    db.connect();
    db.query(sql, (err, sqlRes) => {
        if (err) {
            console.log(err.message);
            res.send({
                code: "201",
                err: "服务器有问题了",
                data: err.message
            });
        }
        else {
            if (sqlRes) {
                res.send({
                    code: "200",
                    err: "ok",
                    data: sqlRes
                });
            }
        }
    })
    db.end()
})
module.exports = router