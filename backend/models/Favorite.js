const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true }, // Đổi từ ObjectId -> String
    recipeIds: [{ type: String, ref: 'Recipe' }] // Đổi từ ObjectId -> String
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
