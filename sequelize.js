const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      useUTC: true, // 데이터 베이스 읽기용
      dateStrings: true, // 데이터를 문자열로 가져옴
      typeCast: true, // 타임존을 역으로 계산하지 않음
    },
    timezone: '+09:00',
    pool: {
      max: 20,   // 최대 유지 connection 수
      min: 5,    // 최소 유지 connection 수
      idle: 60000 // connection을 몇ms까지 대기시킬 것인가 (이후엔 버려짐)
    },
  },
  production: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_PRODUCTION_DATABASE,
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT,
    dialect: 'mysql',
    dialectOptions: {
      useUTC: true, // 데이터 베이스 읽기용
      dateStrings: true, // 데이터를 문자열로 가져옴
      typeCast: true, // 타임존을 역으로 계산하지 않음
    },
    timezone: '+09:00',
    pool: {
      max: 20,   // 최대 유지 connection 수
      min: 5,    // 최소 유지 connection 수
      idle: 600000 // connection을 몇ms까지 대기시킬 것인가 (이후엔 버려짐)
    },
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '+09:00'
  }
}