const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models'); 
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userStoreRoutes = require('./routes/userStoreRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', userStoreRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Roxiler Assignment Backend is running successfully!" });
});

const PORT = process.env.PORT || 5000;

console.log("Password check:", process.env.DB_PASSWORD);


sequelize.authenticate()
    .then(async () => {
        console.log('Database connected successfully!');
        await sequelize.sync({ alter: true }); 
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });