import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [ratings, setRatings] = useState({}); 
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchStores = async () => {
        try {
            const res = await API.get(`/stores?search=${search}`);
            setStores(res.data);
        } catch (err) {
            console.error('Error fetching stores', err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [search]);

    const handleRatingSubmit = async (storeId) => {
        const ratingVal = ratings[storeId];
        if (!ratingVal || ratingVal < 1 || ratingVal > 5) {
            return alert('Please select a valid rating between 1 and 5.');
        }

        try {
            await API.post('/ratings', {
                store_id: storeId,
                user_id: user.id,
                rating: Number(ratingVal)
            });
            alert('Rating submitted successfully!');
            fetchStores();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to submit rating');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Welcome, {user.name} (User Dashboard)</h1>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
                </div>

                {/* Search Bar */}
                <input 
                    type="text" 
                    placeholder="Search stores by name or address..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 border rounded mb-6"
                />

                {/* Store List */}
                <div className="space-y-4">
                    {stores.length === 0 ? (
                        <p className="text-gray-500 text-center">No stores found.</p>
                    ) : (
                        stores.map((store) => {
                            
                            const totalRatings = store.ratings?.length || 0;
                            const avgRating = totalRatings > 0 
                                ? (store.ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(1) 
                                : 'No ratings yet';

                            return (
                                <div key={store.id} className="border p-4 rounded flex justify-between items-center bg-gray-50">
                                    <div>
                                        <h3 className="text-lg font-semibold">{store.name}</h3>
                                        <p className="text-sm text-gray-600">Address: {store.address}</p>
                                        <p className="text-sm text-gray-600">Email: {store.email}</p>
                                        <p className="text-sm font-medium text-blue-600 mt-1">Average Rating: ⭐ {avgRating}</p>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <select 
                                            value={ratings[store.id] || ''} 
                                            onChange={(e) => setRatings({ ...ratings, [store.id]: e.target.value })}
                                            className="p-2 border rounded"
                                        >
                                            <option value="">Rate</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                        <button 
                                            onClick={() => handleRatingSubmit(store.id)} 
                                            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}