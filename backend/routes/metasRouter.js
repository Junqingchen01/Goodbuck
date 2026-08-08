const express = require('express');
const router = express.Router();
const metasController = require('../controllers/metasController');
const authenticateToken = require('../utilities/utilities');

/**
 * @swagger
 * tags:
 *   name: Metas
 *   description: Metas operations
 */

/**
 * @swagger
 * /metas:
 *   get:
 *     summary: Get all Metas
 *     tags: [Metas]
 *     responses:
 *       200:
 *         description: Get all Metas successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Metas retrieved successfully
 *               metas:
 *                 - MetaID: 1
 *                   Name: Example Meta 1
 *                   Description: Example Description 1
 *                   TargetDate: '2024-01-31'
 *                   Status: In Progress
 *                   Progress: 50
 *                 - MetaID: 2
 *                   Name: Example Meta 2
 *                   Description: Example Description 2
 *                   TargetDate: '2024-02-29'
 *                   Status: Not Started
 *                   Progress: 0
 */

/**
 * @swagger
 * /metas/{Metaid}:
 *   get:
 *     summary: Get Meta by ID
 *     tags: [Metas]
 *     parameters:
 *       - in: path
 *         name: Metaid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Meta ID
 *     responses:
 *       200:
 *         description: Meta retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Meta retrieved successfully
 *               meta:
 *                 MetaID: 1
 *                 Name: Example Meta 1
 *                 Description: Example Description 1
 *                 TargetDate: '2024-01-31'
 *                 Status: In Progress
 *                 Progress: 50
 *       404:
 *         description: Meta not found
 *         content:
 *           application/json:
 *             example:
 *               message: Meta not found
 */

/**
 * @swagger
 * /metas:
 *   post:
 *     summary: Create new Meta
 *     tags: [Metas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Description:
 *                 type: string
 *               TargetDate:
 *                 type: string
 *                 format: date
 *               Status:
 *                 type: string
 *               Progress:
 *                 type: integer
 *             required:
 *               - Name
 *               - Description
 *               - TargetDate
 *               - Status
 *               - Progress
 *     responses:
 *       201:
 *         description: Meta created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Meta created successfully
 *               meta:
 *                 MetaID: 3
 *                 Name: New Meta
 *                 Description: New Description
 *                 TargetDate: '2024-03-31'
 *                 Status: Not Started
 *                 Progress: 0
 */

/**
 * @swagger
 * /metas/{Metaid}:
 *   put:
 *     summary: Update Meta by ID
 *     tags: [Metas]
 *     parameters:
 *       - in: path
 *         name: Metaid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Meta ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Description:
 *                 type: string
 *               TargetDate:
 *                 type: string
 *                 format: date
 *               Status:
 *                 type: string
 *               Progress:
 *                 type: integer
 *             required:
 *               - Name
 *               - Description
 *               - TargetDate
 *               - Status
 *               - Progress
 *     responses:
 *       200:
 *         description: Meta updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Meta updated successfully
 *               meta:
 *                 MetaID: 1
 *                 Name: Updated Meta
 *                 Description: Updated Description
 *                 TargetDate: '2024-01-31'
 *                 Status: In Progress
 *                 Progress: 75
 *       404:
 *         description: Meta not found
 *         content:
 *           application/json:
 *             example:
 *               message: Meta not found
 */

/**
 * @swagger
 * /metas/{Metaid}:
 *   delete:
 *     summary: Delete Meta by ID
 *     tags: [Metas]
 *     parameters:
 *       - in: path
 *         name: Metaid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Meta ID
 *     responses:
 *       200:
 *         description: Meta deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Meta deleted successfully
 *       404:
 *         description: Meta not found
 *         content:
 *           application/json:
 *             example:
 *               message: Meta not found
 */
router.get('/',authenticateToken.validateToken, metasController.getAllMetas);
router.get('/:Metaid',authenticateToken.validateToken, metasController.getMetaByID);

router.post('/',authenticateToken.validateToken, metasController.createMeta);

router.put('/:Metaid',authenticateToken.validateToken, metasController.updateMeta);

router.delete('/:Metaid',authenticateToken.validateToken, metasController.deleteMeta);



module.exports = router;