const jwt = require('jsonwebtoken');
const utility = require("utility");

let secretOrPrivateKey = "zhuzuS" // 这是加密的key（密钥） 

const Jwts = (data) => {
    const { username, password } = data
    var sha1Value1 = utility.sha1(username);
    var sha1Value2 = utility.sha1(password);
    // console.log(sha1Value1, sha1Value2);

    let token = jwt.sign({ username: sha1Value1, password: sha1Value2 }, secretOrPrivateKey, {
        expiresIn: 20  // 1小时过期
    });
    // console.log(token);
    return token;
}

//解密
const Jwtt = (data) => {
    return jwt.verify(data, secretOrPrivateKey, (err, decoded) => {
        if (err) {
            console.log(err);
            return 1;
        }
        else {
            console.log(decoded);
            return 2;
        }
    });
}
module.exports = { Jwts, Jwtt };