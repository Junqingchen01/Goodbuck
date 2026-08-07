const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connections/mysql").sequelize;
const { User } = require("./user"); 
class Orçamento extends Model {}

Orçamento.init(
  {
    OrçamentoID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'UserID',
      },
    },
    Category: DataTypes.STRING,
    Amount: DataTypes.DECIMAL(10, 2),
    Period: DataTypes.STRING,
    StartDate: DataTypes.DATE,
    EndDate: DataTypes.DATE,
    Reminder: DataTypes.BOOLEAN,
  },
  { sequelize, modelName: "Orçamento" }
);

sequelize.sync({ force: false }).then(() => {
  console.log("Orçamento table synced");
}).catch((err) => {
  console.log("Error syncing Orçamento table");
});

exports.Orçamento = Orçamento;
