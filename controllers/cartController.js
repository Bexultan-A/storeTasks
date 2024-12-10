const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

class cartController {
    // Добавление продукта в корзину
    async addToCart(req, res) {
        try {
            const { product_id, quantity } = req.body;
            const user_id = req.user.id;

            const product = await Product.findByPk(product_id);

            // Проверка, существует ли продукт в базе данных
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Проверка, есть ли уже этот продукт в корзине пользователя
            const existingCartItem = await Cart.findOne({
                where: { user_id, product_id }
            });
    
            // Если продукт уже есть в корзине, обновляем его количество
            if (existingCartItem) {
                existingCartItem.quantity += quantity;
                await existingCartItem.save();
                return res.status(200).json(existingCartItem);
            } else {
                // Если продукта нет в корзине, создаем новый элемент корзины
                const cartItem = await Cart.create({ user_id, product_id, quantity });
                return res.status(201).json(cartItem);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }

    // Просмотр корзины пользователя
    async viewCart(req, res) {
        try {
            const user_id = req.user.id;
            const cart = await Cart.findAll({ where: { user_id } });
            res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }

    // Обновление количества продукта в корзине
    async updateCartItem(req, res) {
        try {
            const { product_id } = req.params;
            const { quantity } = req.body;
            const user_id = req.user.id;
        
            // Находим продукт в корзине пользователя
            const cartItem = await Cart.findOne({ where: { user_id, product_id } });
            if (!cartItem) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }
        
            // Обновляем количество продукта в корзине
            cartItem.quantity = quantity;
            await cartItem.save();
        
            res.status(200).json(cartItem);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }    

    // Удаление продукта из корзины
    async deleteFromCart(req, res) {
        try {
            const { product_id } = req.params;
            const user_id = req.user.id;

            // Находим продукт в корзине пользователя
            const cartItem = await Cart.findOne({ where: { user_id, product_id } });
            if (!cartItem) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            // Удаляем продукт из корзины
            await cartItem.destroy();
            res.status(200).json({ message: 'Item removed from cart' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }
}

module.exports = new cartController();
