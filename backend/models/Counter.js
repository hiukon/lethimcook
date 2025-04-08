const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: String,         // Tên của loại counter, ví dụ 'recipeId'
  seq: Number          // Giá trị hiện tại
});

module.exports = mongoose.model('Counter', counterSchema);
