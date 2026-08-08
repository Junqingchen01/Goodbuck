const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connections/mysql").sequelize;
const { User } = require("./user");

class Despesa extends Model {}

Despesa.init(
  {
    DespesaID: {
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
    Date: DataTypes.DATE,
    Category: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['Casa', 'Jogo', 'Carro', 'Comida', 'Saúde', 'Família', 'Trabalho', 'Roupas', 'Outros']],
      },
    },
    Description: DataTypes.TEXT,
    PaymentMethod: DataTypes.STRING,
    Amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false, 
    },
  },
  { sequelize, modelName: "Despesa" }
);

User.hasMany(Despesa, { foreignKey: 'UserID' });
Despesa.belongsTo(User, { foreignKey: 'UserID' });

sequelize.sync({ force: false }).then(() => {
  console.log("Despesa table synced");
}).catch((err) => {
  console.log("Error syncing Despesa table");
});

exports.Despesa = Despesa;
