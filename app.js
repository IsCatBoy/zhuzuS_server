// 1. 导入express
const express = require("express");
const { port, host } = require("./server.config");
// 2. 创建express实例
const app = express();
// 3. 处理跨域
app.all("*", (req, res, next) => {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  // 让options尝试请求快速结束
    else
        next();
});
// 4. 监听 
app.listen(port, "0.0.0.0");

// 5. 处理中间件

const bodyParser = require("body-parser");
// application/x-www-form-urlencoded 解析
app.use(bodyParser.urlencoded({ extended: false }));
// application/json 解析
app.use(bodyParser.json());

// 6. 处理路由
const base_regionRoute = require("./routes/base_region");
// const otherRoute = require("./routes/other");
// const shoppingCartRoute = require("./routes/shopping-cart");
const loginRegisterRoute = require("./routes/user");
app.use("/", base_regionRoute);
// app.use("/shopping_cart", shoppingCartRoute);
// app.use("/", otherRoute);
app.use("/", loginRegisterRoute);

// 7. 处理静态资源
app.use(express.static("public"));


// 8. 打印输出提示信息
console.log(`server running at http://${host}:${port}`);

//监听聊天
// let ws = require("nodejs-websocket");
// console.log("开始建立链接");
// ws.createServer(function (conn) {
//     conn.on("text", function (str) {
//         console.log("收到的信息为", str);
//         conn.send(`${str}（机器人`)
//     });
//     conn.on("close", function (code, reason) {
//         console.log("关闭连接")
//     });
//     conn.on("error", function (code, reason) {
//         console.log("异常关闭")
//     })
// }).listen(8001,);
// console.log("链接建立完毕");


var ws = require("nodejs-websocket");

// JavaScript 日期处理类库
var moment = require('moment');

console.log("开始建立连接...")
let users = [];

let conns = {};

//向所有链接的客户端广播
function boardcast(obj) {

    console.log(JSON.stringify(obj));

    // bridge用来实现一对一的主要参数
    if (obj.bridge && obj.bridge.length) {
        console.log(obj.bridge);
        obj.bridge.forEach(item => {
            conns[item].sendText(JSON.stringify(obj));
        })
        return;
    }
    server.connections.forEach((conn) => {
        conn.sendText(JSON.stringify(obj));
    })
}

function getDate() {
    return moment().format("YYYY-MM-DD HH:mm:ss")
}

var server = ws.createServer(function (conn) {
    conn.on("text", function (obj) {
        obj = JSON.parse(obj);

        // 将所有uid对应的连接conn存到一个对象里面
        conns['' + obj.uid + ''] = conn;
        if (obj.type === 1) {
            let isuser = users.some(item => {
                return item.uid === obj.uid
            })
            if (!isuser) {
                users.push({
                    nickname: obj.nickname,
                    uid: obj.uid
                });
            }
            boardcast({
                type: 1,
                date: getDate(),
                msg: obj.nickname + '加入聊天室',
                users: users,
                uid: obj.uid,
                nickname: obj.nickname,
                // 增加参数
                bridge: obj.bridge
            });
        } else {
            boardcast({
                type: 2,
                date: getDate(),
                msg: obj.msg,
                uid: obj.uid,
                nickname: obj.nickname,
                // 增加参数
                bridge: obj.bridge
            });
        }
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8001)
console.log("WebSocket建立完毕")



