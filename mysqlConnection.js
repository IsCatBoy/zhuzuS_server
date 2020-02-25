// 导入mysql模块
const mysql = require("mysql");
// 默认配置
const defaultOptions = {
    host: '47.107.131.149',
    port: '23306',
    user: 'root',
    password: 'Zxit@2018',
    database: 'zhuzu'
}
// 获取connection对象
function getConnection(options = defaultOptions) {
    return mysql.createConnection(options);
}
// 导出getConnection
module.exports = getConnection;

