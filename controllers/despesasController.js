const { validationResult } = require("express-validator");
const { User } = require("../models/user");
const { Despesa } = require("../models/despesa");
const { Sequelize } = require('sequelize');

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

        res.status(200).json({
            message: "Despesa deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting despesa:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

