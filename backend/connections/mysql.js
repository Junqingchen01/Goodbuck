const { Sequelize } = require("sequelize");
require('dotenv').config();

/********************************************************************************
 * [新增/修改功能]: 数据库连接环境变量动态配置 (Environment Variables Configuration)
 * [修改原因]: 避免在源码中硬编码数据库账号与敏感密码，提升系统安全性，并支持多环境部署
 ********************************************************************************/
const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'joaoferr_ESMAPP_23_24_GRP3',
  username: process.env.DB_USER || 'joaoferr_ESMAPP_23_24_GRP3',
  password: process.env.DB_PASSWORD || 'tgvBq4pjvtSe',
  host: process.env.DB_HOST || 'www.joaoferreira.eu',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql', 
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
/********************************************************************************/

exports.sequelize = sequelize;

