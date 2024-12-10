const express = require('express');
const bodyParser = require('body-parser');
const productRouter = require('./routes/productRouter');
const sequelize = require('./config/db');
const Product = require('./models/productModel');

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

const PORT = process.env.PORT || 3000;


const app = express();
app.use(bodyParser.json());
app.use(productRouter);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

sequelize.sync().then(() => {
    console.log('Database synchronized!');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));