const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  description: { type: String, required: true },
  image: { type: String, default: '' }
});

const ReactionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // ví dụ: 'like', 'love', 'haha', 'wow'
  user_ids: [{ type: String, ref: 'User' }]
});

const RecipeSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [StepSchema], required: true }, // <-- thêm dấu phẩy ở đây
  reactions: { type: [ReactionSchema], default: [] }
});

module.exports = mongoose.model('Recipe', RecipeSchema);