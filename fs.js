const fs = require('fs');
const multer = require('../config/multer');

//파일 삭제
exports.fsDelete = async (req) => {
    var imgLength = req.files.length;
    for (i = 0; i < imgLength; i++) {
        var img = req.files[i].path;
        fs.unlink(img, function (err) {
            if (err) {
                console.log('fs 파일 삭제 실패 : ' + err);
            } else {
                console.log('fs 파일 삭제 완료');
            }
        })
    }
}

//기존 이미지 파일 삭제
exports.preImgDelete = async (preImg) => {
    for (i = 0; i < preImg.length; i++) {
        var preImgPath = preImg[i].original_name;
        fs.unlink(preImgPath, function (err) {
            if (err) {
                console.log('fs 파일 삭제 실패 : ' + err);
            } else {
                console.log('fs 파일 삭제 완료');
            }
        })
    }
}

//s3 들어온 이미지 바로 삭제(오류시)
exports.s3Delete = async (req) => {
    var imgLength = req.files.length;
    for (i = 0; i < imgLength; i++) {
        var params = {
            Bucket: 'roomix-img',
            Key: req.files[i].key
        };
        multer.del(params, (err) => {
            if (err) {
                console.log('s3 이미지 파일 삭제 실패 : ' + err);
            } else {
                console.log('s3 이미지 파일 삭제 완료');
            }
        })
    }
}

//s3 기존 이미지 파일 삭제
exports.s3PreImgDelete = async (preImg) => {
    for (i = 0; i < preImg.length; i++) {
        var preImgPath = preImg[i].original_name;
        var params = {
            Bucket: 'roomix-img',
            Key: preImgPath
        }
        multer.del(params, (err) => {
            if (err) {
                console.log('s3 이미지 파일 삭제 실패 : ' + err);
            } else {
                console.log('s3 이미지 파일 삭제 완료');
            }
        })
    }
}