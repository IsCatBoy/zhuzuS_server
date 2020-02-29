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
                    var form = new formidable.IncomingForm();
                    form.uploadDir = "public/touxiang/";
                    form.parse(req, function (err, fields, files) {
                        console.log(fields);
                        console.log(files);
                        //获取是时间搓
                        let timestamp = (new Date()).valueOf();
                        let nam = "zhuzu";
                        //头像名
                        let imgname = null;
                        //重命名
                        if (files.uploader) {
                            imgname = nam + timestamp + files.uploader.name;
                            fs.renameSync(files.uploader.path, "public/touxiang/" + imgname);
                        }
                        let imgurl = `http://${host}:${port}/touxiang/${imgname}`;
                        
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
module.exports = router;