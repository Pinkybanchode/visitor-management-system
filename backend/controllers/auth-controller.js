const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
    return jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET
        );
}
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.register(name, email, password, role)
        const token = createToken(user._id)

        res.json({
            success: true,
            message: "User created successfully",
            data: { user: email, token }
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
}
exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.login(email,password)
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const token = createToken(user)

        res.json({
            token,
            user
        });
    }
    catch(Error){
        res.status(400).json({
            error: Error.message
        });
    }

    
}