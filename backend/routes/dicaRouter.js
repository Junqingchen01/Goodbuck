const express = require('express');
const router = express.Router();
const dicasController = require('../controllers/dicasController');
const authenticateToken = require('../utilities/utilities');

/**
 * @swagger
 * tags:
 *   name: Dicas
 *   description: Use Dicas 
 */

/**
 * @swagger
 * /dicas:
 *   post:
 *     summary: Create new Dica
 *     tags: [Dicas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Content:
 *                 type: string
 *               Type:
 *                 type: string
 *               Author:
 *                 type: string
 *               Level:
 *                 type: string
 *               IsPremium:
 *                 type: boolean
 *             required:
 *               - Title
 *               - Content
 *               - Type
 *               - Author
 *               - Level
 *               - IsPremium
 *     responses:
 *       201:
 *         description: Dica created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Dica created successfully
 *               dica:
 *                 DicaID: 1
 *                 Title: Example Title
 *                 Content: Example Content
 *                 Type: Finanças
 *                 Date: 2024-01-10T12:30:45.678Z
 *                 Author: John Doe
 *                 Level: Beginner
 *                 IsPremium: false
 */

/**
 * @swagger
 * /dicas:
 *   get:
 *     summary: Get all Dicas
 *     tags: [Dicas]
 *     responses:
 *       200:
 *         description: Get all Dicas successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Dicas retrieved successfully
 *               dicas:
 *                 - DicaID: 1
 *                   Title: Example Title
 *                   Content: Example Content
 *                   Type: Finanças
 *                   Date: 2024-01-10T12:30:45.678Z
 *                   Author: John Doe
 *                   Level: Beginner
 *                   IsPremium: false
 *                 - DicaID: 2
 *                   Title: Another Title
 *                   Content: Another Content
 *                   Type: Poupança
 *                   Date: 2024-01-11T10:15:30.123Z
 *                   Author: Jane Doe
 *                   Level: Novice
 *                   IsPremium: true
 */

/**
 * @swagger
 * /dicas/{idDica}:
 *   get:
 *     summary: Get Dica by ID
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: idDica
 *         schema:
 *           type: integer
 *         required: true
 *         description: Dica ID
 *     responses:
 *       200:
 *         description: Dica retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Dica retrieved successfully
 *               dica:
 *                 DicaID: 1
 *                 Title: Example Title
 *                 Content: Example Content
 *                 Type: Finanças
 *                 Date: 2024-01-10T12:30:45.678Z
 *                 Author: John Doe
 *                 Level: Beginner
 *                 IsPremium: false
 *       404:
 *         description: Dica not found
 *         content:
 *           application/json:
 *             example:
 *               message: Dica not found
 */

/**
 * @swagger
 * /dicas/{idDica}:
 *   delete:
 *     summary: Delete Dica by ID
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: idDica
 *         schema:
 *           type: integer
 *         required: true
 *         description: Dica ID
 *     responses:
 *       200:
 *         description: Dica deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Dica deleted successfully
 *       404:
 *         description: Dica not found
 *         content:
 *           application/json:
 *             example:
 *               message: Dica not found
 */


router.post('/',authenticateToken.validateToken, dicasController.createDica);

router.get('/',authenticateToken.validateToken, dicasController.getAllDica);

router.get('/:idDica',authenticateToken.validateToken, dicasController.getDicaById);

router.put('/:id',authenticateToken.validateToken, dicasController.updateDica);
router.delete('/:idDica',authenticateToken.validateToken, dicasController.deleteDica);


module.exports = router;