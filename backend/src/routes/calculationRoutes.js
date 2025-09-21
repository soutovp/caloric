// backend/src/routes/calculationRoutes.js
const express = require('express');
const asyncHandler = require('../utils/asyncHandler.js');
const { protect } = require('../middlewares/authMiddleware.js');
const { saveCalculation, getCalculationsHistory, getLastCalculation } = require('../services/calculationService.js');

const router = express.Router();

// Todas as rotas de cálculo exigem autenticação
router.use(protect); // Aplica o middleware 'protect' a todas as rotas neste router

// @desc    Guardar um novo cálculo nutricional (dados vêm do frontend)
// @route   POST /api/calculations
// @access  Private
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const userId = req.user.id; // ID do utilizador vem do middleware 'protect'
        const calculationData = req.body; // Assume que o frontend envia todos os dados calculados

        const newCalculation = await saveCalculation(userId, calculationData);
        res.status(201).json(newCalculation);
    })
);

// @desc    Obter o histórico de cálculos do utilizador
// @route   GET /api/calculations
// @access  Private
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const calculations = await getCalculationsHistory(userId);
        res.status(200).json(calculations);
    })
);

// @desc    Obter o último cálculo do utilizador
// @route   GET /api/calculations/latest
// @access  Private
router.get(
    '/latest',
    asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const lastCalculation = await getLastCalculation(userId);
        // Retorna null se não houver cálculos, ou o último
        res.status(200).json(lastCalculation);
    })
);

module.exports = router;