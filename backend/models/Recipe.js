const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true }, // Thêm trường 'author'
    image: { type: String, required: true }, // Thêm trường 'image' để lưu URL ảnh
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
