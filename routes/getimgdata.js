const express = require("express");
const router = express.Router();
const getConnection = require("../mysqlConnection");
const { host, port } = require("../server.config");


// 首页de
router.get("/getarticle", (req, res) => {
    //get亲求的参数获取
    console.log(req.query);
    //创建查询语句
    let sql = `select *,(select count(*) from res_comment where res_comment.comment_type=1 and res_comment.article_id=res_article.article_id ) zdNum 
    ,(select count(*) from res_comment where res_comment.comment_type=2 and res_comment.article_id=res_article.article_id ) plNum 
    ,(select count(*) from res_comment where res_comment.comment_type=3 and res_comment.article_id=res_article.article_id ) zfnum
    from res_article inner join base_user
    on base_user.user_id=res_article.create_user_id ORDER BY article_id DESC`;
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
router.get("/getarticles", (req, res) => {
    //get亲求的参数获取
    console.log(req.query);
    let { type } = req.query;
    //创建查询语句
    let sql = `select *,(select count(*) from res_comment where res_comment.comment_type=1 and res_comment.article_id=res_article.article_id ) zdNum 
    ,(select count(*) from res_comment where res_comment.comment_type=2 and res_comment.article_id=res_article.article_id ) plNum 
    ,(select count(*) from res_comment where res_comment.comment_type=3 and res_comment.article_id=res_article.article_id ) zfnum
    from res_article inner join base_user
    on base_user.user_id=res_article.create_user_id 
    where article_type=${type}
    ORDER BY article_id DESC`;
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