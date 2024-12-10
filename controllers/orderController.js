const Cart = require('../models/cartModel');
const Product = require('../models/productModel')
const Order = require('../models/orderModel');

class orderController {
    async checkout(req, res) {
        try {
            const user_id = req.user.id;
            const cartItems = await Cart.findAll({ where: { user_id } });
    
            // Проверка пуста ли корзина
            if (!cartItems.length) {
                return res.status(400).json({ message: 'Cart is empty' });
            }
    
            var totalPrice = 0;
            var notAvailableProducts = [];

            // Проверка доступности продуктов
            await Promise.all(cartItems.map(async (item) => {
                const product = await Product.findByPk(item.product_id);
                if (!product.quantity || product.quantity <= 0 || product.quantity < item.quantity) {
                    notAvailableProducts.push(product.name)
                }                 
            }));

            if (notAvailableProducts.length > 0) {
                const message = notAvailableProducts.length > 1
                    ? `Products ${notAvailableProducts.join(', ')} are not available in storage.`
                    : `Product ${notAvailableProducts[0]} is not available in storage.`;
                return res.status(409).json({ message });
            }

            // Обновить колчество продуктов и посчитать стоимость
            await Promise.all(cartItems.map(async (item) => {
                const product = await Product.findByPk(item.product_id);
                await product.update({ quantity: product.quantity - item.quantity });
                totalPrice += product.price * item.quantity;                
            }));
    
            // Создать запись в таблице orders
            const order = await Order.create({ user_id, total_price: totalPrice });
    
            // Очистка корзины
            await Cart.destroy({ where: { user_id } }); 
            res.status(201).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }

    // Просмотр записей
    async getOrders(req, res) {
        try {
            const user_id = req.user.id;
            const orders = await Order.findAll({ where: { user_id } });
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }
}

module.exports = new orderController();
