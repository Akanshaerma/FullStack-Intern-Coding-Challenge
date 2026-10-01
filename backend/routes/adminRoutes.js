const express = require('express');
const router = express.Router();
const { 
    getAdminStats, 
    getAllUsers, 
    createUserByAdmin 
} = require('../controllers/adminController');

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.post('/users', createUserByAdmin);

module.exports = router;