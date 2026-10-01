const express = require('express');
const router = express.Router();
const { 
    getStoresForUser, 
    submitOrUpdateRating, 
    getStoreOwnerDashboard,
    createStore 
} = require('../controllers/userStoreController');

router.get('/stores', getStoresForUser);
router.post('/stores', createStore);
router.post('/ratings', submitOrUpdateRating);
router.get('/owner-dashboard/:owner_id', getStoreOwnerDashboard);

module.exports = router;