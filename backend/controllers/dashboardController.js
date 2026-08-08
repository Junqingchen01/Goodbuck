const { Despesa } = require("../models/despesa");
const { Sequelize } = require('sequelize');
const { User } = require("../models/user");

/********************************************************************************
 * [新增/修改功能]: Redis 聚合计算结果缓存 (Dashboard Aggregation Query Caching)
 * [修改原因]: 大盘 SQL 计算 (GROUP BY) 属于高频高 CPU 操作，优先从 Redis 缓存获取结果 (TTL 10分钟)，大幅减少 MySQL 读压力
 ********************************************************************************/
const { getCache, setCache } = require("../connections/redis");

// Função para calcular o total de despesas por categoria
exports.AllAmountByCategory = async (req, res) => {
  try {
    const UserID = req.userID;
    const cacheKey = `dashboard:category:${UserID}`;

    // 1. 尝试从 Redis 读取缓存
    const cachedTotals = await getCache(cacheKey);
    if (cachedTotals) {
      return res.status(200).json({
        message: 'Category totals retrieved from Redis cache',
        categoryTotals: cachedTotals,
        cached: true
      });
    }

    // 2. 若未命中缓存，执行数据库底层 SQL 聚合查询
    const categoryTotals = await Despesa.sequelize.query(
      'SELECT Category, SUM(Amount) as TotalAmountByCategory FROM Despesas WHERE UserID = :userID GROUP BY Category',
      {
        replacements: { userID: UserID },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    // 3. 将计算结果写入 Redis 缓存 (TTL: 600秒/10分钟)
    await setCache(cacheKey, categoryTotals, 600);

    res.status(200).json({ message: 'Category totals retrieved successfully', categoryTotals, cached: false });
  } catch (error) {
    console.error('Error calculating category total amounts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Função para calcular o total de despesas
exports.AllAmount = async (req, res) => {
  try {
    const UserID = req.userID;
    const cacheKey = `dashboard:total:${UserID}`;

    const cachedAmount = await getCache(cacheKey);
    if (cachedAmount) {
      return res.status(200).json({
        message: 'Total amount retrieved from Redis cache',
        allAmount: cachedAmount,
        cached: true
      });
    }

    const allAmount = await Despesa.sequelize.query(
      'SELECT SUM(Amount) as TotalAmount FROM Despesas WHERE UserID = :userID',
      {
        replacements: { userID: UserID },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    await setCache(cacheKey, allAmount, 600);
    res.status(200).json({ message: 'Total amount retrieved successfully', allAmount, cached: false });
  } catch (error) {
    console.error('Error calculating total amount:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Função para calcular o total de despesas por data mes
exports.AllAmountByMonth = async (req, res) => {
  try {
    const UserID = req.userID;
    const cacheKey = `dashboard:month:${UserID}`;

    const cachedMonthTotals = await getCache(cacheKey);
    if (cachedMonthTotals) {
      return res.status(200).json({
        message: 'Total amounts for each month retrieved from Redis cache',
        allAmountByMonth: cachedMonthTotals,
        cached: true
      });
    }

    const allAmountByMonth = await Despesa.sequelize.query(
      'SELECT MONTH(Date) as Month, SUM(Amount) as TotalAmountByMonth FROM Despesas WHERE UserID = :userID GROUP BY MONTH(Date)',
      {
        replacements: { userID: UserID },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    await setCache(cacheKey, allAmountByMonth, 600);
    res.status(200).json({ message: 'Total amounts for each month retrieved successfully', allAmountByMonth, cached: false });
  } catch (error) {
    console.error('Error calculating total amounts for each month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
/********************************************************************************/