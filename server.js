const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const productRouter = require('./routes/productRouter');
const authRouter = require('./routes/authRouter');
const orderRouter = require('./routes/orderRouter');
const cartRouter = require('./routes/cartRouter.js')

const sequelize = require('./config/db');

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

const PORT = process.env.PORT || 3000;


const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

app.use(authRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

sequelize.sync().then(() => {
    console.log('Database synchronized!');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));