const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Добавить продукт в корзину
router.post('/cart', authMiddleware, cartController.addToCart);

// Удалить продукт из корзины
router.delete('/cart/:product_id', authMiddleware, cartController.deleteFromCart);

// Изменить количество продукта в корзине
router.put('/cart/:product_id', authMiddleware, cartController.updateCartItem);

// Получить содержимое корзины
router.get('/cart', authMiddleware, cartController.viewCart);

module.exports = router;
