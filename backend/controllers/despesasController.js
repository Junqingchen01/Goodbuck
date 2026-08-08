const { validationResult } = require("express-validator");
const { User } = require("../models/user");
const { Despesa } = require("../models/despesa");
const { Sequelize } = require('sequelize');

/********************************************************************************
 * [新增/修改功能]: 旁路缓存失效机制 (Cache Aside Pattern - Cache Invalidation)
 * [修改原因]: 当用户新增或删除账单消费记录时，主动删除该用户的 Redis 大盘缓存，确保下一次查询获取最新真实数据
 ********************************************************************************/
const { delCache } = require("../connections/redis");

const clearUserDashboardCache = async (userID) => {
    await delCache(`dashboard:category:${userID}`);
    await delCache(`dashboard:total:${userID}`);
    await delCache(`dashboard:month:${userID}`);
};
/********************************************************************************/

//get all despesas
exports.GetUserDespesas = async (req, res) => {
    try {
        const UserID = req.userID;

        const userWithDespesas = await User.findOne({
            where: { UserID: UserID },
            attributes: ['UserID', 'Name'], 
            include: {
                model: Despesa,
                attributes: ['DespesaID', 'Date', 'Category', 'Description', 'PaymentMethod', 'Amount'],
            },
        });

        if (!userWithDespesas) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User despesas retrieved successfully",
            user: userWithDespesas,
        });
    } catch (error) {
        console.error("Error getting user despesas:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//create despesa
exports.createDespesa = async (req, res) => {
    try {
        const UserID = req.userID; 
        const { Category, Description, PaymentMethod, Amount } = req.body;

        const user = await User.findOne({
            where: { UserID: UserID },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newDate = new Date();


        const newDespesa = await Despesa.create({
            UserID: UserID,
            Date: newDate,
            Category,
            Description,
            PaymentMethod,
            Amount
        });

/********************************************************************************
 * [新增/修改功能]: 创建账单后清除该用户的 Redis 缓存
 * [修改原因]: 数据发生变动，保证缓存数据不一致性被立即清除
 ********************************************************************************/
        await clearUserDashboardCache(UserID);
/********************************************************************************/

        res.status(201).json({
            message: "Despesa created successfully",
            despesa: newDespesa,
        });
    } catch (error) {
        console.error("Error creating despesa:", error);
        res.status(500).json({ message: "Internal Server Error" ,error});
    }
};

//get despesa by id
exports.getDespesaById = async (req, res) => {
    try {
        const UserID = req.userID;  
        const despesaID = req.params.idDespesa;  

        if (!UserID || !despesaID) {
            return res.status(400).json({ message: "User ID and Despesa ID are required" });
        }

        const despesa = await Despesa.findOne({
            where: { UserID: UserID, DespesaID: despesaID },
        });

        if (!despesa) {
            return res.status(404).json({ message: "Despesa not exist" });
        }

        res.status(200).json({
            message: "Despesa retrieved successfully",
            despesa: despesa,
        });
    } catch (error) {
        console.error("Error getting despesa:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//delete despesa by id
exports.deleteDespesaById = async (req, res) => {
    try {
        const UserID = req.userID; 
        const despesaID = req.params.idDespesa;  

        if (!UserID || !despesaID) {
            return res.status(400).json({ message: "User ID and Despesa ID are required" });
        }

        const despesa = await Despesa.findOne({
            where: { UserID: UserID, DespesaID: despesaID },
        });

        if (!despesa) {
            return res.status(404).json({ message: "Despesa not exist" });
        }

        await despesa.destroy();

/********************************************************************************
 * [新增/修改功能]: 删除账单后清除该用户的 Redis 缓存
 * [修改原因]: 数据发生变动，保证缓存数据不一致性被立即清除
 ********************************************************************************/
        await clearUserDashboardCache(UserID);
/********************************************************************************/

        res.status(200).json({
            message: "Despesa deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting despesa:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


