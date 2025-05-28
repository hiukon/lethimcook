const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  description: { type: String, required: true },
  image: { type: String, default: '' }
});

const RecipeSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [StepSchema], required: true } // <-- cập nhật ở đây
});

module.exports = mongoose.model('Recipe', RecipeSchema);