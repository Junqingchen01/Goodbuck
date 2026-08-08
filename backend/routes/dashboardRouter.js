const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../utilities/utilities');


/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard operations
 */

/**
 * @swagger
 * /dashboard/{id}/allamount:
 *   get:
 *     summary: Get total amount
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Total amount retrieved successfully
 *               totalAmount: 500.00
 */

/**
 * @swagger
 * /dashboard/{id}/amount:
 *   get:
 *     summary: Get amount by category
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Amount by category retrieved successfully
 *               amountByCategory:
 *                 Casa: 100.00
 *                 Jogos: 50.00
 *                 Carro: 75.00
 *                 Comida: 200.00
 */

/**
 * @swagger
 * /dashboard/{id}/amountbymonth:
 *   get:
 *     summary: Get amount by month
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Amount by month retrieved successfully
 *               amountByMonth:
 *                 January: 150.00
 *                 February: 200.00
 */
router.get('/allamount',authenticateToken.validateToken, dashboardController.AllAmount);
router.get('/amount',authenticateToken.validateToken, dashboardController.AllAmountByCategory);
router.get('/amountbymouth',authenticateToken.validateToken, dashboardController.AllAmountByMonth);

module.exports = router;