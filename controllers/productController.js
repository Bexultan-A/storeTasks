const Product = require('../models/productModel');

class productController {
    async getAllProducts(req, res) {
        const products = await Product.findAll();
        res.status(200).json(products);
    }

    async getProductById(req, res) {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product Not Found'});
        }
        res.status(200).json(product);
    }

    async createProduct(req, res) {
        const { name, price, description, category } = req.body;
        const newProduct = await Product.create({ name, price, description, category });
        res.status(201).json(newProduct);
    }

    async updateProduct(req, res) {
        const { name, price, description, category } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.update({ name, price, description, category });
        res.status(200).json(product);
    }

    async deleteProduct(req, res) {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.destroy();
        res.status(200).json({ message: 'Product deleted' });
    }
}

module.exports = new productController();