const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');
// const sharp = require('sharp');

//s3 설정값
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
});

//s3 업로드
const storage = multerS3({
    s3: s3,
    bucket: 'roomix-img',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        var today = (year + month + date + hours + minutes + seconds);
        const ext = path.extname(file.originalname);
        var filename = today + '_' + path.basename(file.originalname, ext) + ext;
        cb(null, `uploads/${filename}`);
    }
})

exports.upload = multer({ storage: storage });

//s3 업로드 파일 삭제
exports.del = (params) => s3.deleteObject(params, function (err, data) {
    if (err) {
        console.log(params);
        console.log('s3 삭제 에러 : ' + err);
    } else {
        console.log('삭제 완료');
    }
})

//사진 리사이즈 테스트
// exports.resize = async (req, res, next) => {
//     if (!req.files) return next();

//     req.body.images = [];
//     await Promise.all(
//         req.files.map(async file => {
//             await sharp(file.buffer)
//                 .resize(400)
//                 .toBuffer()
//                 .toFile(`upload/${newFilename}`);

//             req.body.images.push(newFilename);
//         })
//     );
//     console.log(req.body.images);
//     next();
// };

// exports.getResult = async (req, res) => {
//     if (req.body.images.length <= 0) {
//         return res.send(`You must select at least 1 image.`);
//     }

//     const images = req.body.images
//         .map(image => "" + image + "")
//         .join("");

//     return res.send(`Images were uploaded:${images}`);
// };

// exports.resize = async (req, res, next) => {

//     var filename = req.files[0].location;

//     console.log(filename);

//     await sharp(filename)
//         .resize({
//             width: parseInt(400),
//             fit: sharp.fit.contain
//         })
//         .toBuffer()
// }

