const Recipe = require('../models/Recipe');

// Lấy tất cả công thức
exports.getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        return res.json(recipes);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// Thêm công thức mới
exports.createRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ message: "Không thể tạo món ăn" });
    }
};

// Xóa công thức
exports.deleteRecipe = async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa công thức!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa công thức" });
    }
};

// 📌 Lấy chi tiết công thức theo ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Không tìm thấy công thức" });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 📌 Cập nhật công thức theo ID
exports.updateRecipe = async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRecipe) {
            return res.status(404).json({ message: "Không tìm thấy công thức" });
        }
        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật công thức" });
    }
};

// 📌 Tìm kiếm công thức theo tên món ăn
exports.searchRecipes = async (req, res) => {
    try {
        const keyword = req.query.q;
        const recipes = await Recipe.find({ name: { $regex: keyword, $options: 'i' } });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tìm kiếm công thức" });
    }
};

// 📌 Lọc công thức theo nguyên liệu
exports.filterRecipesByIngredient = async (req, res) => {
    try {
        const ingredient = req.query.ingredient;
        const recipes = await Recipe.find({ ingredients: { $in: [ingredient] } });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lọc công thức" });
    }
};
