const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require("./routes/favoriteRoutes");
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',   // Cho phép mọi domain truy cập
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use('/images', express.static(path.join(__dirname, 'public/images')));

mongoose.connect("mongodb://127.0.0.1:27017/recipes")
.then(() => console.log('🔗 Kết nối MongoDB thành công'))
.catch(err => console.log('❌ Lỗi kết nối MongoDB:', err));
// Endpoint mặc định tại "/"
app.get('/', (req, res) => {
    res.send('🌟 Chào mừng đến với API của Let Him Cook!');
});

// Sử dụng routes
app.use('/api', recipeRoutes);
app.use('/api/user', userRoutes);
app.use('/api', favoriteRoutes);
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Chạy trên IPv4

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server chạy tại http://${HOST}:${PORT}`);
});


