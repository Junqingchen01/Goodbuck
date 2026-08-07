const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const authenticateToken = require('../utilities/utilities');

/**
 * @swagger
 * tags:
 *   name: Perfil
 *   description: User profiles
 */

/**
 * @swagger
 * /perfil/login:
 *   post:
 *     summary: User login
 *     description: Login with user credentials
 *     tags: [Perfil]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /perfil/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user profile
 *     tags: [Perfil]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               // Add other properties as needed
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Bad request
 */

/**
 * @swagger
 * /perfil:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users
 *     tags: [Perfil]
 *     responses:
 *       '200':
 *         description: Users retrieved successfully
 *       '401':
 *         description: Unauthorized
 */

/**
 * @swagger
 * /perfil/user:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user by their ID
 *     tags: [Perfil]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *       '404':
 *         description: User not found
 */

/**
 * @swagger
 * /perfil:
 *   put:
 *     summary: Update user by ID
 *     description: Update user details by their ID
 *     tags: [Perfil]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               // Add other properties as needed
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '404':
 *         description: User not found
 */

/**
 * @swagger
 * /perfil/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete a user by their ID
 *     tags: [Perfil]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 */

/**
 * @swagger
 * /perfil/Premium:
 *   post:
 *     summary: Buy Premium for user
 *     description: Upgrade user to Premium
 *     tags: [Perfil]
 *     responses:
 *       '200':
 *         description: Premium bought successfully
 *       '404':
 *         description: User not found
 */

/**
 * @swagger
 * /perfil/Premium:
 *   get:
 *     summary: Get Premium info for user
 *     description: Retrieve Premium information for a user
 *     tags: [Perfil]
 *     responses:
 *       '200':
 *         description: Premium info retrieved successfully
 *       '404':
 *         description: User not found
 */

router.post('/login', perfilController.login);
router.get('/',perfilController.getAllUsers);
router.get('/user',authenticateToken.validateToken, perfilController.getUserById);
router.post('/register', perfilController.register);

router.put('/',authenticateToken.validateToken, perfilController.updateUser);
router.delete('/:id',authenticateToken.validateToken, perfilController.deleteUser);

router.post('/Premium',authenticateToken.validateToken, perfilController.BuyPremium);  
router.get('/Premium',authenticateToken.validateToken, perfilController.getInfoPremium);  

module.exports = router;
