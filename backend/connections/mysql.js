const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: 'joaoferr_ESMAPP_23_24_GRP3',
  username: 'joaoferr_ESMAPP_23_24_GRP3',
  password: 'tgvBq4pjvtSe',
  host: 'www.joaoferreira.eu',
  dialect: 'mysql', 
});

exports.sequelize = sequelize;
