var { Admin, Users } = require('../models/index');
//jwt설정
const jwt = require('jsonwebtoken')
const secret = require('../config/jwt').KEY.secret

exports.adminCheck = async (req, res, next) => {
    //인증확인
    const token = req.headers.token || req.body.token;
    let jwt_secret = secret;

    if (!token) {
        res.status(400).json({ status: 400, success: false, msg: '토큰 없음', result: 0 });
    }
    const checkToken = ((resolve, reject) => {
        jwt.verify(token, jwt_secret, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    })
    checkToken(async token => {
        var username = token.username;
        var admin = await Admin.findOne({
            where: { username: username }
        })
        if (admin != null) {
            console.log('admin 확인');
            next();
        } else {
            console.log('admin 없음');
            res.status(400).json({ status: 400, success: false, msg: 'admin 아님', result: 0 });
        }
    })
}

exports.jwtMiddleware = async (req, res, next) => {
    try {
        //토큰 값 헤더로 가져오기
        const token = req.headers.token || req.body.token
        let jwt_secret = secret;
        //만약 토큰이 없다면
        if (!token) {
            res.status(400).json({ status: 400, success: false, msg: '토큰 없음', result: 0 });
        }
        //토큰 확인
        function decodeToken(token) {
            return new Promise((resolve, reject) => {
                jwt.verify(token, jwt_secret, (error, decoded) => {
                    if (error) reject(error);
                    resolve(decoded);
                });
            });
        }
        //토큰 디코딩
        const decoded = await decodeToken(token);
        // req.token에 디코딩된 값을 넣어줌
        req.token = decoded;
        console.log('토큰 디코딩 성공');
        return next();
    } catch (err) {
        // token 디코딩 실패
        req.token = null;
        console.log('토큰 디코딩 실패' + err);
        res.status(403).json({ status: 403, success: false, msg: '토큰 만료', result: 0 });
        return next();
    }
};

exports.userCheck = async (req, res, next) => {
    //인증확인
    const token = req.headers.token || req.body.token;
    let jwt_secret = secret;

    if (!token) {
        res.status(400).json({ status: 400, success: false, msg: '토큰 없음', result: 0 });
    }
    const checkToken = ((resolve, reject) => {
        jwt.verify(token, jwt_secret, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    })
    checkToken(async token => {
        var username = token.username;
        var user = await Users.findOne({
            where: { username: username }
        })
        if (user != null) {
            // req.token에 디코딩된 값을 넣어줌
            req.token = token;
            console.log('user 확인');
            next();
        } else {
            console.log('user 아님');
            res.status(400).json({ status: 400, success: false, msg: 'user 아님', result: 0 });
        }
    })
}

exports.nonmemberTokenCheck = async (req, res, next) => {
    try {
        //토큰 값 헤더로 가져오기
        const token = req.headers.token || req.body.token
        let jwt_secret = secret;
        console.log('token: ' + token);
        //만약 토큰이 없다면
        if (token === 0) {
            console.log('비회원 시공의뢰');
            req.token = 0;
            console.log('token : ' + req.token);
            return next();
        }
        //토큰 확인
        function decodeToken(token) {
            return new Promise((resolve, reject) => {
                jwt.verify(token, jwt_secret, (error, decoded) => {
                    if (error) reject(error);
                    resolve(decoded);
                });
            });
        }
        //토큰 디코딩
        const decoded = await decodeToken(token);
        // req.token에 디코딩된 값을 넣어줌
        req.token = decoded;
        console.log('토큰 디코딩 성공');
        return next();
    } catch (err) {
        // token 디코딩 실패
        console.log('토큰 디코딩 실패 or 비회원(토큰 없음) : ' + err);
        return next();
    }
};