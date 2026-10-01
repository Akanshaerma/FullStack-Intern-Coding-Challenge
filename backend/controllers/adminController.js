const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();

        res.json({
            totalUsers,
            totalStores,
            totalRatings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        let queryOptions = {};

        let conditions = [];
        if (search) {
            conditions.push({
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { address: { [Op.iLike]: `%${search}%` } }
                ]
            });
        }
        if (role) {
            conditions.push({ role });
        }

        if (conditions.length > 0) {
            queryOptions.where = { [Op.and]: conditions };
        }

        const users = await User.findAll(queryOptions);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUserByAdmin = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newUser = await User.create({ name, email, password, address, role });
        res.status(201).json({ message: "User created successfully!", newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    createUserByAdmin
};