const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe");


// Lấy danh sách công thức yêu thích của user
const getFavorites = async (req, res) => {
    try {
        const userId = req.userId; // Lấy userId từ middleware
        if (!userId) return res.status(400).json({ message: "Thiếu userId" });
        console.log(userId);
        const favorites = await Favorite.findOne({ userId });
        if (!favorites || !favorites.recipeIds.length) return res.json({ recipes: [] });

        // Chuyển đổi favorites.recipeIds từ string sang number
        const recipeIdsAsNumbers = favorites.recipeIds.map(id => Number(id));

        // Truy vấn công thức sử dụng recipeIds đã chuyển sang number
        const recipes = await Recipe.find({ id: { $in: recipeIdsAsNumbers } });

        res.json({ recipes });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Thêm công thức vào danh sách yêu thích
const addFavorite = async (req, res) => {
    try {
        const { recipeId } = req.body;
        const userId = req.userId; // Lấy userId từ middleware
        if (!userId || !recipeId) {
            return res.status(400).json({ message: "Thiếu userId hoặc recipeId" });
        }

        let favorites = await Favorite.findOne({ userId });

        if (!favorites) {
            favorites = new Favorite({ userId, recipeIds: [recipeId] });
        } else {
            if (!favorites.recipeIds.includes(recipeId)) {
                favorites.recipeIds.push(recipeId);
            }
        }

        await favorites.save();
        res.json({ message: "Đã thêm vào danh sách yêu thích", favorites });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xóa công thức khỏi danh sách yêu thích
const removeFavorite = async (req, res) => {
    try {
        const { recipeId } = req.body;
        const userId = req.userId; // Lấy userId từ middleware
        if (!userId || !recipeId) {
            return res.status(400).json({ message: "Thiếu userId hoặc recipeId" });
        }

        let favorites = await Favorite.findOne({ userId });

        if (favorites) {
            favorites.recipeIds = favorites.recipeIds.filter(id => id !== recipeId);
            await favorites.save();
            res.json({ message: "Đã xóa khỏi danh sách yêu thích", favorites });
        } else {
            res.status(404).json({ message: "Không tìm thấy danh sách yêu thích" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
