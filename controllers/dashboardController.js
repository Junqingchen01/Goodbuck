const { Despesa } = require("../models/despesa");
const { Sequelize } = require('sequelize');
const { User } = require("../models/user");

// Função para calcular o total de despesas por categoria
exports.AllAmountByCategory = async (req, res) => {
  try {
    const UserID = req.userID;

    const categoryTotals = await Despesa.sequelize.query(
      'SELECT Category, SUM(Amount) as TotalAmountByCategory FROM Despesas WHERE UserID = :userID GROUP BY Category',
      {
        replacements: { userID: UserID },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    console.log(categoryTotals);
    res.status(200).json({ message: 'Category totals retrieved successfully', categoryTotals });
  } catch (error) {
    console.error('Error calculating category total amounts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Função para calcular o total de despesas
exports.AllAmount = async (req, res) => {
  try {
    const UserID = req.userID;

    const allAmount = await Despesa.sequelize.query(
      'SELECT SUM(Amount) as TotalAmount FROM Despesas WHERE UserID = :userID',
      {
        replacements: { userID: UserID },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    console.log(allAmount);
    res.status(200).json({ message: 'Total amount retrieved successfully', allAmount });
  } catch (error) {
    console.error('Error calculating total amount:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Função para calcular o total de despesas por data mes
exports.AllAmountByMonth = async (req, res) => {
  try {
    const UserID = req.userID;

    const allAmountByMonth = await Despesa.sequelize.query(
      'SELECT MONTH(Date) as Month, SUM(Amount) as TotalAmountByMonth FROM Despesas WHERE UserID = :userID GROUP BY MONTH(Date)',
      {
        replacements: { userID: UserID },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    console.log(allAmountByMonth);
    res.status(200).json({ message: 'Total amounts for each month retrieved successfully', allAmountByMonth });
  } catch (error) {
    console.error('Error calculating total amounts for each month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};