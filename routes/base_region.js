const express = require("express");
const router = express.Router();
const getConnection = require("../mysqlConnection");
const { host, port } = require("../server.config");

router.get("/getregion", (req, res) => {
    //get亲求的参数获取
    console.log(req.query);
    //创建查询语句
    let sql = "SELECT * FROM base_region";
    //
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
            console.log(sqlRes);
            res.send({
                code: "200",
                err: "ok",
                data: sqlRes
            });
        }
    })
    db.end()
})

module.exports = router