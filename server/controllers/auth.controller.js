import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from "../models/User.model";

import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js'


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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({ success: true, token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}