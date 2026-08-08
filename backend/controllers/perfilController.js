const { validationResult } = require("express-validator");
const { User } = require("../models/user");
const { Premium } = require("../models/premiun");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sequelize } = require('sequelize');

// login
exports.login = async (req, res) => {
  try {
    const { Name, Password } = req.body;
    const user = await User.findOne({
      where: { Name },
    });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(Password, user.Password);

      if (isPasswordMatch) {
        const token = jwt.sign(
          { UserID: user.UserID, Name: user.Name, UserType: user.UserType },
          "secret-key",
          { expiresIn: "1h" } 
        );

        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// so para testar, neste funcao nao é de aplicacao
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
  
      if (users.length > 0) {
        res.status(200).json(users);
        console.log("Users:", users);

      } else {
        res.status(204).json({ message: "No users found" });
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

// get informacao de utilizador
exports.getUserById = async (req, res) => {
  try {
    const UserID = req.userID;

      const user = await User.findOne({
          where: { UserID: UserID },
      });

      if (!user) {
        
          return res.status(404).json({ message: "User not found" });
      }

      const premium = await Premium.findOne({
          where: {
              UserID: UserID,
              EndDate: { [Sequelize.Op.gte]: new Date() }, 
          },
      });

      let accountType = 'Inactive';

      if (premium && premium.EndDate >= new Date()) {
          accountType = 'Active';

          await User.update(
              { AccountType: accountType },
              { where: { UserID: UserID } }
          );
      }

      const updatedUser = await User.findOne({
          where: { UserID: UserID },
      });

      res.status(200).json({ message: "User retrieved successfully", user: updatedUser });
  } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

// register
exports.register = async (req, res) => {
    try {
      const { Name, Email, Password } = req.body;
  
      const existingUser = await User.findOne({
        where: { Email },
      });
  
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(Password, 10);
  
      const newUser = await User.create({
        Name,
        Email,
        Password: hashedPassword, 
      });
  
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

// update
exports.updateUser = async (req, res) => {
  try {
      const { Name, Email, Password, Avatar, CurrencyUnit } = req.body;

      const UserID = req.userID;

      const user = await User.findOne({
          where: { UserID: UserID },
      });

      if (!user) {
        
          return res.status(404).json({ message: "User not found" });
      }

      const updateFields = {};

      if (Name !== undefined) updateFields.Name = Name;
      if (Email !== undefined) updateFields.Email = Email;
      if (Password !== undefined) {
          const hashedPassword = await bcrypt.hash(Password, 10);
          updateFields.Password = hashedPassword;
      }
      if (Avatar !== undefined) updateFields.Avatar = Avatar;
      if (CurrencyUnit !== undefined) updateFields.CurrencyUnit = CurrencyUnit;

      await User.update(updateFields, { where: { UserID: UserID } });

      res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
      const userID = req.params.id;

      const user = await User.findOne({
          where: { UserID: userID },
      });

      if (!user) {
        
          return res.status(404).json({ message: "User not found" });
      }

      await User.destroy({
          where: { UserID: userID },
      });

      res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

// comprar premiun
exports.BuyPremium = async (req, res) => {
  try {
      const { Plan, Price, PaymentMethod, TransactionCode } = req.body;
      const UserID = req.userID; 

      const user = await User.findOne({
          where: { UserID },
      });

      if (!user) {
        
          return res.status(404).json({ message: "User not found" });
          
      }

      // Data começa agora e a data de término será daqui a um mês
      const StartDate = new Date();
      const EndDate = new Date();
      EndDate.setMonth(EndDate.getMonth() + 1);

      const newPremium = await Premium.create({
          UserID,
          StartDate,
          EndDate,
          Plan,
          Price,
          Status: 'Active', 
          PaymentMethod,
          TransactionCode,
      });

      res.status(201).json({ message: "Premium purchased successfully", premium: newPremium });
  } catch (error) {
      console.error("Error purchasing Premium:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

// ver informacao de premiun
exports.getInfoPremium = async (req, res) => {
  try {
   
    const UserID = req.userID; 
    console.log(UserID)

      const premium = await Premium.findOne({
          where: { UserID },
      });

      if (!premium) {
          return res.status(404).json({ message: "Premium not found" });
      }

      res.status(200).json({ message: "Premium retrieved successfully", premium });
  } catch (error) {
      console.error("Error getting Premium:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }

}
