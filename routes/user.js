const express = require("express");
const router = express.Router();
const getConnection = require("../mysqlConnection");
const { host, port } = require("../server.config");
const { Jwts, Jwtt } = require("../jwt");
const formidable = require("formidable");
const fs = require('fs');
//登陆
router.post("/login", (req, res) => {
    // http://175.24.82.120:8888
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
    console.log("token" + token);
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

//下来图片到服务器
function xiazai(imgData, donlowPath, imgname) {
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(`${donlowPath}${imgname}`, dataBuffer, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("cg")
        }
    });
}

//修改信息
router.post("/updata", (req, res) => {
    console.log(`修改接口」 被调用！`);
    let token = req.headers.authorization;
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
        try {
            function upDatainfo() {
                return new Promise((reslove, reject) => {
                    const form = formidable({ multiples: true });
                    // var form = new formidable.IncomingForm();
                    //  form.uploadDir = "public/touxiang/";
                    form.parse(req, function (err, fields, files) {
                        console.log(fields);
                        console.log(files);
                        function isnickname(id) {
                            if (fields.nickname) {
                                let sqlselectu_name = `SELECT * FROM base_user where nickname = '${fields.nickname}' and user_id <> ${id}`;
                                const db = getConnection();
                                db.connect();
                                db.query(sqlselectu_name, (err, sqlres) => {
                                    if (err) {
                                        console.log(err.message);
                                        res.send({
                                            code: 223,
                                            err: "err",
                                            message: err.message
                                        })
                                    }
                                    else {
                                        if (sqlres.length > 0) {
                                            res.send({
                                                code: 222,
                                                err: "err",
                                                message: '用户名已存在'
                                            })
                                        }
                                        else {
                                            // 获取是时间搓
                                            let timestamp = (new Date()).valueOf();
                                            let nam = "zhuzu";
                                            //头像名
                                            let imgname = null;
                                            let imgurl = null;
                                            if (fields.profile != "undefined") {
                                                imgurl = fields.profile;
                                            }
                                            //重命名
                                            if (files.profile) {
                                                imgname = nam + timestamp + files.profile.name;
                                                imgurl = `http://${host}:${port}/touxiang/${imgname}`;
                                                fs.renameSync(files.profile.path, "public/touxiang/" + imgname);
                                            }
                                            const dbyu = getConnection();
                                            dbyu.connect();
                                            let sqlupdatau_info = `UPDATE base_user SET nickname='${fields.nickname}',sex=${fields.sex},profile='${imgurl}',remark='${fields.remark}',region_id=${fields.region_id},birthday='${fields.birthday}' WHERE user_id=${fields.user_id}`;
                                            console.log(sqlupdatau_info);
                                            dbyu.query(sqlupdatau_info, (err, sqlres) => {
                                                if (err) {
                                                    console.log(err.message);
                                                    res.send({
                                                        code: 223,
                                                        err: "err",
                                                        message: err.message
                                                    })
                                                }
                                                else {
                                                    console.log(sqlres);
                                                    if (sqlres.affectedRows == 1) {
                                                        const dbyus = getConnection();
                                                        dbyus.connect();
                                                        let sqlselectu_info = `SELECT * FROM base_user where user_id=${fields.user_id}`;
                                                        console.log(sqlselectu_info);
                                                        dbyus.query(sqlselectu_info, (err, sqlres) => {
                                                            if (err) {
                                                                console.log(err.message);
                                                                res.send({
                                                                    code: 223,
                                                                    err: "err",
                                                                    message: "信息没有来得及更新，小问题"
                                                                })
                                                            } else {
                                                                const sqldata = sqlres[0];
                                                                // console.log(sqlres);
                                                                if (sqldata) {
                                                                    res.send({
                                                                        code: "200",
                                                                        err: "ok",
                                                                        message: "上传成功",
                                                                        data: sqldata,
                                                                    })
                                                                }
                                                                else {
                                                                    res.send({
                                                                        code: "201",
                                                                        err: "err",
                                                                        message: "信息没有来得及更新，小问题"
                                                                    })
                                                                }
                                                            }
                                                        })
                                                    }
                                                    else {
                                                        res.send({
                                                            code: 226,
                                                            err: "ok",
                                                            message: "上传失败"
                                                        })
                                                    }
                                                    console.log(sqlres.affectedRows === 1);
                                                }
                                            });
                                            dbyu.end();
                                        }
                                    }
                                });
                                db.end();
                            }
                        }
                        if (fields.user_id) {
                            let sqlselectu_id = `SELECT * FROM base_user where user_id = ${fields.user_id}`;
                            const dby = getConnection();
                            dby.connect();
                            dby.query(sqlselectu_id, (err, sqlres) => {
                                if (err) {
                                    console.log(err.message);
                                    res.send(err.message)
                                }
                                else {
                                    //有就修改
                                    if (sqlres.length > 0) {
                                        isnickname(fields.user_id)
                                    }

                                    console.log();
                                }
                            });
                            dby.end();
                        }
                        else {
                            console.log("没人")
                        }
                    });
                })
            }
            upDatainfo().then((data) => {
                res.send({
                    code: 200,
                    err: "ok",
                    message: data
                })
            }, (err) => {
                res.send({
                    code: 222,
                    err: "err",
                    message: err
                })
            })

        } catch (error) {
            res.send({
                code: 212,
                err: "err",
                message: error
            })
        }

    }
})

//发布
router.post("/releaapi", (req, res) => {
    console.log(`修改接口」 被调用！`);
    let token = req.headers.authorization;
    const Jwttres = Jwtt(token)
    if (Jwttres === 1) {
        console.log("token已过期");
        res.send({
            code: 409,
            err: "err",
            message: "token已过期"
        })
    } else {
        const form = formidable({ multiples: true });
        // var form = new formidable.IncomingForm();
        // form.uploadDir = "public/touxiang/";
        form.parse(req, function (err, fields, files) {
            console.log(fields);
            console.log(files);
        })
    }
})
module.exports = router;