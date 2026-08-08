const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connections/mysql").sequelize;
const { User } = require("./user");

class Notification extends Model {}

Notification.init(
  {
    NotificationID: {
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
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "Notification" }
);

sequelize.sync({ force: false }).then(() => {
  console.log("Notification table synced");
}).catch((err) => {
  console.log("Error syncing Notification table");
});

exports.Notification = Notification;
