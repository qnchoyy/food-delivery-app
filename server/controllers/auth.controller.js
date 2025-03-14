import bcrypt from 'bcryptjs';

import User from "../models/User.model";


export const register = async (req, res) => {
    try {
        const { name, lastName, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User alredy exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            lastName,
            email,
            password: hashedPassword,
            phone,
        });

        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}