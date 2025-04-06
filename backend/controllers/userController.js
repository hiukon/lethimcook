const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng nhập người dùng
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra xem tài khoản có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại. Vui lòng đăng ký." });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Sai mật khẩu" });
        }

        // Tạo token JWT
        const token = jwt.sign({ userId: user._id }, "SECRET_KEY", { expiresIn: "10m" });
        const refreshToken = jwt.sign({ userId: user._id }, "REFRESH_SECRET" , { expiresIn: '7d' });
        console.log('123',token);
        console.log("456",refreshToken);
        res.json({ message: "Đăng nhập thành công", token ,refreshToken,  user: {username : user.username, userId: user._id}});
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Đăng ký người dùng
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};
