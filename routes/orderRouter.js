const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Оформить заказ
router.post('/checkout', authMiddleware, orderController.checkout);

// Получить список своих заказов
router.get('/orders', authMiddleware, orderController.getOrders);

module.exports = router;
