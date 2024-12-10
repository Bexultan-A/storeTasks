const Product = require('../models/productModel');

class productController {
    // Получение всех продуктов
    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll();
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }

    // Получение продукта по его ID
    async getProductById(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product Not Found'});
            }
            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }

     // Создание нового продукта
    async createProduct(req, res) {
        try {
            const { name, price, description, category, quantity } = req.body;
            const newProduct = await Product.create({ name, price, description, category, quantity });
            res.status(201).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }

    // Обновление данных продукта
    async updateProduct(req, res) {
        try {
            const { name, price, description, category, quantity } = req.body;
            
            const product = await Product.findByPk(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            await product.update({ name, price, description, category, quantity });
            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }

    // Удаление продукта
    async deleteProduct(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            await product.destroy();
            res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }
}

module.exports = new productController();