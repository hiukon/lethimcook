const User = require('../models/User');
const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const { recipeId, content } = req.body;
    const userId = req.userId; // Lấy từ middleware

    // Lấy username từ DB
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    const comment = new Comment({ recipeId, content, username: user.username, userId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm bình luận' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.json({ message: "Đã xóa bình luận!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa bình luận" });
  }
};

exports.getCommentsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const comments = await Comment.find({ recipeId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy bình luận' });
  }
};
