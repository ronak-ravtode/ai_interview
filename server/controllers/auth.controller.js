import User from "../models/user.model.js";
import { generateToken } from "../config/token.js";

const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email });
        }
        const token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,

        })
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: `Error in Google Auth: ${error.message}` });
    }
}

const logout = async (req, res) => {
    try {
        await res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: `Error in Logout: ${error.message}` });
    }
};

export { googleAuth, logout };