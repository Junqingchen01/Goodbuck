const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connections/mysql").sequelize;
const { User } = require("./user"); 

class Meta_de_poupança extends Model {}

Meta_de_poupança.init(
  {
    MetaID: {
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
    Name: DataTypes.STRING,
    StartDate: DataTypes.DATE,
    EndDate: DataTypes.DATE,
    PlannedContribution: DataTypes.DECIMAL(10, 2),
    CurrentContribution: DataTypes.DECIMAL(10, 2),
    Description: DataTypes.TEXT,
    Priority: {
      type: DataTypes.STRING,
      validate: {
          isIn: ['Importante', 'Normal'],
      },
  },
  },
  { sequelize, modelName: "Meta_de_poupança" }
);

sequelize.sync({ force: false }).then(() => {
  console.log("Meta_de_poupança table synced");
}).catch((err) => {
  console.log("Error syncing Meta_de_poupança table");
});

exports.Meta_de_poupança = Meta_de_poupança;
