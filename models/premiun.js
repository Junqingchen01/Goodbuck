const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connections/mysql").sequelize;
const { User } = require("./user"); 

class Premium extends Model {}

Premium.init(
  {
    PremiumID: {
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
    StartDate: DataTypes.DATE,
    EndDate: DataTypes.DATE,
    Plan: DataTypes.STRING,
    Price: DataTypes.DECIMAL(10, 2),
    Status: DataTypes.STRING,
    PaymentMethod: DataTypes.STRING,
    TransactionCode: DataTypes.STRING,
  },
  { sequelize, modelName: "Premium" }
);

sequelize.sync({ force: false }).then(() => {
  console.log("Premium table synced");
}).catch((err) => {
  console.log("Error syncing Premium table");
});

exports.Premium = Premium;
