const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Получение всех продуктов
router.get('/products', ProductController.getAllProducts);

// Получение продукта по ID
router.get('/products/:id', ProductController.getProductById);

// Создание нового продукта
router.post('/products', ProductController.createProduct);

// Обновление продукта по ID
router.put('/products/:id', ProductController.updateProduct);

// Удаление продукта по ID
router.delete('/products/:id', ProductController.deleteProduct);

module.exports = router;