const Recipe = require('../models/Recipe');
const { OpenAI } = require('openai');
const axios = require('axios');
const getNextId = require('./getNextId');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
});

// 📸 Lấy ảnh từ Pixabay
async function getRecipeImage(keyword) {
    try {
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: process.env.PIXABAY_API_KEY,
                q: keyword,
                image_type: 'photo',
                per_page: 3,
            }
        });
        const hits = response.data.hits;
        return hits.length > 0 ? hits[0].webformatURL : '';
    } catch (error) {
        console.error("Lỗi lấy ảnh từ Pixabay:", error.message);
        return '';
    }
}

// 📥 Lấy ảnh cho từng bước nấu ăn
async function getStepImages(stepDescriptions) {
    const stepObjects = [];
    for (const description of stepDescriptions) {
        const image = await getRecipeImage(description);
        stepObjects.push({ description, image });
    }
    return stepObjects;
}

// 🔍 Parse nội dung từ GPT: tách nguyên liệu + danh sách bước mô tả
function parseRawGPTContent(content) {
    const ingredients = content.match(/(?<=Nguyên liệu:)([\s\S]*?)(?=Cách làm:)/i)?.[0]
        .split('\n')
        .map(i => i.trim())
        .filter(i => i.length > 0);

    const stepDescriptions = content.match(/(?<=Cách làm:)([\s\S]*)/i)?.[0]
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    return { ingredients, stepDescriptions };
}

// 📚 Lấy toàn bộ công thức
exports.getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ➕ Thêm công thức mới
exports.createRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ message: "Không thể tạo món ăn" });
    }
};

// ❌ Xóa công thức
exports.deleteRecipe = async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa công thức!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa công thức" });
    }
};

// 🔍 Lấy công thức theo ID
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

// ✏️ Cập nhật công thức
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

// 🔍 Tìm kiếm theo tên món ăn
exports.searchRecipes = async (req, res) => {
    try {
        const keyword = req.query.q ? req.query.q.trim() : '';
        let recipes = await Recipe.find({ name: { $regex: keyword, $options: 'i' } });

        if (recipes.length > 0){
             await Recipe.updateMany(
                { _id: { $in: recipes.map(r => r._id) } },
                { $inc: { searchCount: 1 } }
            );
            return res.json(recipes);
        } 

        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: `Hãy cung cấp công thức nấu ăn cho món ${keyword}. Bao gồm nguyên liệu và cách làm.`
            }]
        });

        const gptContent = gptResponse.choices[0].message.content;
        const { ingredients, stepDescriptions } = parseRawGPTContent(gptContent);
        const steps = await getStepImages(stepDescriptions);
        const imageUrl = await getRecipeImage(keyword);
        const nextId = await getNextId('recipeId');

       const newRecipe = new Recipe({
           id: nextId,
           name: keyword,
           author: "Gpt",
           image: imageUrl,
           ingredients,
           steps,
           reactions: [],            // Mặc định là mảng rỗng
           searchCount: 1,           // Nếu là kết quả tìm kiếm đầu tiên, có thể để 1
           totalReadTime: 0,         // Mặc định 0
           readCount: 0              // Mặc định 0
        });

        await newRecipe.save();
        res.status(201).json([newRecipe]);

    } catch (error) {
        console.error("Lỗi searchRecipes:", error);
        res.status(500).json({ message: "Lỗi khi tìm kiếm công thức" });
    }
};

// 🧂 Lọc công thức theo nguyên liệu
exports.filterRecipesByIngredient = async (req, res) => {
    try {
        const ingredient = req.query.q.trim();
        let recipes = await Recipe.find({
            ingredients: { $elemMatch: { $regex: ingredient, $options: 'i' } }
        });

        if (recipes.length > 0) return res.json(recipes);

        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: `Hãy cung cấp công thức nấu ăn với nguyên liệu ${ingredient}. Bao gồm nguyên liệu và cách làm.`
            }]
        });

        const gptContent = gptResponse.choices[0].message.content;
        const { ingredients: newIngredients, stepDescriptions } = parseRawGPTContent(gptContent);
        const steps = await getStepImages(stepDescriptions);
        const imageUrl = await getRecipeImage(ingredient);
        const nextId = await getNextId('recipeId');

        const newRecipe = new Recipe({
            id: nextId,
            name: `Công thức với ${ingredient}`,
            author: "System",
            image: imageUrl,
            ingredients: newIngredients,
            steps
        });

        await newRecipe.save();
        res.status(201).json(newRecipe);

    } catch (error) {
        console.error("Lỗi filterRecipesByIngredient:", error);
        res.status(500).json({ message: "Lỗi khi lọc công thức" });
    }
};

exports.toggleReaction = async (req, res) => {
  try {
    const { recipeId, userId, reactionType } = req.body;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Không tìm thấy món ăn" });

    let reaction = recipe.reactions.find(r => r.type === reactionType);
    if (!reaction) {
      // Nếu chưa có loại reaction này, thêm mới
      reaction = { type: reactionType, user_ids: [userId] };
      recipe.reactions.push(reaction);
    } else {
      // Nếu đã có, kiểm tra user đã thả chưa
      const idx = reaction.user_ids.indexOf(userId);
      if (idx === -1) {
        reaction.user_ids.push(userId);
      } else {
        reaction.user_ids.splice(idx, 1); // Bỏ reaction
      }
    }
    await recipe.save();
    res.json(recipe.reactions);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thả biểu cảm" });
  }
};

exports.trackReadTime = async (req, res) => {
  try {
    const { recipeId, readTime } = req.body;
    await Recipe.findByIdAndUpdate(recipeId, {
      $inc: { totalReadTime: readTime, readCount: 1 }
    });
    res.json({ message: 'Đã ghi nhận thời gian đọc' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi ghi nhận thời gian đọc' });
  }
};

exports.getTopRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ searchCount: -1, totalReadTime: -1 }).limit(10);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy top công thức' });
  }
};