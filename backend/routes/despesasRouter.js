const express = require('express');
const router = express.Router();
const despesasController = require('../controllers/despesasController');
const authenticateToken = require('../utilities/utilities');


/**
 * @swagger
 * tags:
 *   name: Despesas
 *   description: Despesas operations
 */

/**
 * @swagger
 * /despesas/{id}:
 *   get:
 *     summary: Get user despesas
 *     tags: [Despesas]
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
 *               message: User despesas retrieved successfully
 *               user:
 *                 UserID: 1
 *                 Name: John Doe
 *                 despesas:
 *                   - DespesaID: 1
 *                     Date: '2024-01-01'
 *                     Category: 'Casa'
 *                     Description: 'Groceries'
 *                     PaymentMethod: 'Credit Card'
 *                   - DespesaID: 2
 *                     Date: '2024-01-02'
 *                     Category: 'Carro'
 *                     Description: 'Gasoline'
 *                     PaymentMethod: 'Cash'
 */

/**
 * @swagger
 * /despesas/{id}:
 *   post:
 *     summary: Create new despesa
 *     tags: [Despesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *       - in: body
 *         name: despesa
 *         description: Despesa object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             Category:
 *               type: string
 *               enum: ['Casa', 'Jogos', 'Carro', 'Comida']
 *             Description:
 *               type: string
 *             PaymentMethod:
 *               type: string
 *     responses:
 *       '201':
 *         description: Despesa created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Despesa created successfully
 *               despesa:
 *                 DespesaID: 3
 *                 Date: '2024-01-03'
 *                 Category: 'Jogos'
 *                 Description: 'Gaming accessories'
 *                 PaymentMethod: 'Debit Card'
 */

/**
 * @swagger
 * /despesas/{id}/{idDespesa}:
 *   get:
 *     summary: Get despesa by ID
 *     tags: [Despesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idDespesa
 *         required: true
 *         description: Despesa ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Despesa retrieved successfully
 *               despesa:
 *                 DespesaID: 2
 *                 Date: '2024-01-02'
 *                 Category: 'Carro'
 *                 Description: 'Gasoline'
 *                 PaymentMethod: 'Cash'
 */

/**
 * @swagger
 * /despesas/{id}/{idDespesa}:
 *   delete:
 *     summary: Delete despesa by ID
 *     tags: [Despesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idDespesa
 *         required: true
 *         description: Despesa ID
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Despesa deleted successfully
 */
router.get('/',authenticateToken.validateToken, despesasController.GetUserDespesas);
router.post('/',authenticateToken.validateToken, despesasController.createDespesa);

router.get('/:idDespesa',authenticateToken.validateToken, despesasController.getDespesaById );
router.delete('/:idDespesa',authenticateToken.validateToken, despesasController.deleteDespesaById);


module.exports = router;