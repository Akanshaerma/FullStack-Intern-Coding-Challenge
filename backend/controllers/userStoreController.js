const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');


const getStoresForUser = async (req, res) => {
    try {
        const { search } = req.query;
        let queryOptions = {
            include: [
                { model: Rating, as: 'ratings' },
                { model: User, as: 'owner', attributes: ['name', 'email'] }
            ]
        };

        if (search) {
            queryOptions.where = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { address: { [Op.iLike]: `%${search}%` } }
                ]
            };
        }

        const stores = await Store.findAll(queryOptions);
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const submitOrUpdateRating = async (req, res) => {
    try {
        const { store_id, user_id, rating } = req.body;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5." });
        }

        let existingRating = await Rating.findOne({ where: { store_id, user_id } });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
            return res.json({ message: "Rating updated successfully!", existingRating });
        }

        const newRating = await Rating.create({ store_id, user_id, rating });
        res.status(201).json({ message: "Rating submitted successfully!", newRating });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getStoreOwnerDashboard = async (req, res) => {
    try {
        const { owner_id } = req.params;

        const store = await Store.findOne({
            where: { owner_id },
            include: [
                {
                    model: Rating,
                    as: 'ratings',
                    include: [{ model: User, attributes: ['name', 'email', 'address'] }]
                }
            ]
        });

        if (!store) {
            return res.status(404).json({ error: "No store found for this owner." });
        }

        const ratingsList = store.ratings;
        const totalRatingsCount = ratingsList.length;
        const avgRating = totalRatingsCount > 0 
            ? ratingsList.reduce((acc, curr) => acc + curr.rating, 0) / totalRatingsCount 
            : 0;

        res.json({
            storeName: store.name,
            averageRating: avgRating.toFixed(1),
            totalRatings: totalRatingsCount,
            ratingsDetails: ratingsList
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;

        if (!name || !email || !address || !owner_id) {
            return res.status(400).json({ error: "All fields (name, email, address, owner_id) are required." });
        }

        const newStore = await Store.create({ name, email, address, owner_id });
        res.status(201).json({ message: "Store created successfully!", newStore });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getStoresForUser,
    submitOrUpdateRating,
    getStoreOwnerDashboard,
    createStore
};