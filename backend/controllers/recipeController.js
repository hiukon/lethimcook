const Recipe = require('../models/Recipe');
const { OpenAI } = require('openai');
const axios = require('axios');
const getNextId = require('./getNextId');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
});
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


//  Hàm parse nội dung GPT trả về thành ingredients + steps
function parseGPTContent(content) {
    const ingredients = content.match(/(?<=Nguyên liệu:)([\s\S]*?)(?=Cách làm:)/i)?.[0]
        .split('\n')
        .map(i => i.trim())
        .filter(i => i.length > 0);

    const steps = content.match(/(?<=Cách làm:)([\s\S]*)/i)?.[0]
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    return { ingredients, steps };
}

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
        const keyword = req.query.q ? req.query.q.trim() : '';
        // 1. Tìm trong MongoDB trước
        let recipes = await Recipe.find({ name: { $regex: keyword, $options: 'i' } });
        if (recipes.length > 0) {
            return res.json(recipes);
        }

        // 2. Gọi GPT để tạo công thức
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: `Hãy cung cấp công thức nấu ăn cho món ${keyword}. Bao gồm nguyên liệu và cách làm.`
            }]
        });

        const gptContent = gptResponse.choices[0].message.content;
        const { ingredients, steps } = parseGPTContent(gptContent);

        // 3. Gọi Pixabay để lấy ảnh món ăn
        const imageUrl = await getRecipeImage(keyword);

        // 4. Tạo và lưu công thức mới
        const nextId = await getNextId('recipeId');
        const newRecipe = new Recipe({
            id: nextId,  
            name: keyword,
            ingredients:ingredients,
            steps: steps,
            author: "Gpt",
            image: imageUrl
        });

        await newRecipe.save();

        // 5. Trả về công thức vừa tạo
        res.status(201).json(newRecipe);

    } catch (error) {
        console.error("Lỗi searchRecipes:", error);
        res.status(500).json({ message: "Lỗi khi tìm kiếm công thức" });
    }
};
// 📌 Lọc công thức theo nguyên liệu
exports.filterRecipesByIngredient = async (req, res) => {
    try {
        const ingredient = req.query.q.trim();
        console.log("123",ingredient);
        // Tìm công thức trong MongoDB theo nguyên liệu
        // let recipes = await Recipe.find({ ingredients: { $in: [ingredient] } });
        let recipes = await Recipe.find({
            ingredients: { $elemMatch: { $regex: ingredient, $options: 'i' } }
          });

        // Nếu tìm thấy công thức trong MongoDB
        if (recipes.length > 0) {
            return res.json(recipes);
        }

        // Nếu không tìm thấy, gọi GPT để tạo công thức mới với nguyên liệu này
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', 
            messages: [{ role: 'user', content: `Hãy cung cấp công thức nấu ăn với nguyên liệu ${ingredient}. Bao gồm nguyên liệu và cách làm.` }]
        });

        // Lấy nội dung từ GPT và parse thành ingredients và steps
        const gptContent = gptResponse.choices[0].message.content;
        const { ingredients: newIngredients, steps: newSteps } = parseGPTContent(gptContent);

        // Tạo một công thức mới từ GPT
        const newRecipe = new Recipe({
            name: `Công thức với ${ingredient}`,
            ingredients: newIngredients,
            steps: newSteps,
            author: "System", // Bạn có thể thay đổi nếu cần
            image: "", // Thêm ảnh nếu cần
        });

        // Lưu công thức mới vào MongoDB
        await newRecipe.save();

        // Trả về công thức mới tạo
        res.status(201).json(newRecipe);

    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lọc công thức" });
    }
};
