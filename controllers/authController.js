const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

class AuthController {
    // Регистрация нового пользователя
    async register(req, res) {
        try {
            const { email, password, name } = req.body;
    
            // Проверка наличия email в базе
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }
    
            // Хэширование пароля
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Создание нового пользователя
            const newUser = await User.create({ email, password: hashedPassword, name });
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }

    // Вход (логин) пользователя
    async login(req, res) {
        try {
            const { email, password } = req.body;
    
            // Поиск пользователя по email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
    
            // Сравнение пароля
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
    
            // Генерация токена
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            // Хранение токена в cookies
            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,  // Время жизни cookie (1 час)
                sameSite: 'Strict',
            });
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error' });
        }
    }
}

module.exports = new AuthController();