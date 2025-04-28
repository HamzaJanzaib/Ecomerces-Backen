const express = require('express');
const app = express();
require('dotenv').config();
const dBconnect = require('./config/DB/ConnectDB');
const port = process.env.PORT || 3000;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AuthRouter = require('./Routes/Auth.Routes');
const ProductsRouter = require('./Routes/Products.Routes');

dBconnect(process.env.MONGO_URI);
app.use(cors(
    {
        origin: "http://localhost:5173", methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: [
            "Content-Type",
            "Authorization",
            "cache-Control",
            "Expires",
            "pragma"
        ],
        credentials: true
    }
));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', AuthRouter);
app.use('/api/products', ProductsRouter);

const startServer = async () => {
    try {
        await app.listen(port);
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();

