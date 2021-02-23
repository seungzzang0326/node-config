const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AT;
const client = require('twilio')(accountSid, authToken);
const cache = require('memory-cache');

//본인인증 SMS 발송
exports.sms = async (phone) => {
    try {
        var inputPhone = '+82' + phone;

        if (inputPhone != null) {
            var randomNum = Math.floor(Math.random() * 1000000);
            var message = `[루믹스] 인증번호 [${randomNum}]을 입력해주세요.`

            await client.messages.create({
                body: message,
                to: inputPhone,
                from: process.env.TWILIO_FROM
            })
        }
        cache.put('inputPhone', inputPhone, 300000);
        cache.put('randomNum', randomNum, 300000);
        console.log(`문자 보내기 성공 : ${phone}으로 문자 보냄`);
    } catch (error) {
        cache.del('inputPhone', 'randomNum');
        console.error(`문자 보내기 실패 : ${error}`);
    }
}

//본인인증 번호 비교
exports.smsCheck = (phone, randomNum, res) => {
    try {
        var cachePhone = cache.get('inputPhone');
        var cacheRandomNum = cache.get('randomNum');
        var inputPhone = '+82' + phone;
        var inputRandomNum = randomNum;
        console.log(cachePhone);
        console.log(cacheRandomNum);
        console.log(inputPhone);
        console.log(inputRandomNum);
        if (inputRandomNum != null) {
            if (inputRandomNum == cacheRandomNum && inputPhone == cachePhone) {
                console.log('인증되었습니다.');
                cache.del('inputPhone', 'randomNum');
                return 1;
            } else {
                console.log('인증번호 유효기간이 지났습니다. 다시 시도해 주세요.');
                cache.del('inputPhone', 'randomNum');
                return 0;
            }
        } else {
            console.log('인증번호가 일치하지 않습니다. 다시 시도해 주세요.');
            return 0;
        }
    } catch (error) {
        cache.del('inputPhone', 'randomNum');
        console.error(`문자 보내기 실패 : ${error}`);
    }
}