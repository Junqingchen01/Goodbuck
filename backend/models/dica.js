const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connections/mysql").sequelize;

class Dica extends Model {}

Dica.init(
  {
    DicaID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Title: DataTypes.STRING,
    Content: DataTypes.TEXT,
    Type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['Finanças', 'Poupança', 'Investimentos']],
      },
    },
    Date: DataTypes.DATE,
    Author: DataTypes.STRING,
    Level: {
      type: DataTypes.STRING,
      validate: {
        isIn: ['Beginner', 'Novice', 'Expert', 'Master'],
      },
    },
    IsPremium: {
      type: DataTypes.BOOLEAN,
      validate: {
        isIn: [[true, false]],
      },
    }
  },
  { sequelize, modelName: "Dica" }
);

sequelize.sync({ force: false }).then(() => {
  console.log("Dica table synced");
}).catch((err) => {
  console.log("Error syncing Dica table");
});

exports.Dica = Dica;
