const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        if (name.length < 3 || name.length > 50) {
            return res.status(400).json({ error: "Name must be between 3 and 50 characters." });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must be 8-16 chars, include at least one uppercase letter and one special character." });
        }

        if (address.length > 400) {
            return res.status(400).json({ error: "Address cannot exceed 400 characters." });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role: role || 'normal_user'
        });

        res.status(201).json({ message: "User registered successfully!", user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        res.json({
            message: "Login successful!",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};