import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function StoreOwnerDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                const res = await API.get(`/owner-dashboard/${user.id}`);
                setDashboardData(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load store data. Make sure a store is assigned to you.');
            }
        };

        if (user.id) {
            fetchOwnerData();
        }
    }, [user.id]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Store Owner Dashboard</h1>
                        <p className="text-sm text-gray-600">Welcome, {user.name}</p>
                    </div>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                {dashboardData ? (
                    <div className="space-y-6">
                        {/* Store Overview Card */}
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-blue-900">{dashboardData.storeName}</h2>
                                <p className="text-sm text-gray-600 mt-1">Total Ratings Received: <span className="font-bold">{dashboardData.totalRatings}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Average Rating</p>
                                <p className="text-2xl font-bold text-yellow-600">⭐ {dashboardData.averageRating} / 5.0</p>
                            </div>
                        </div>

                        {/* Ratings & Users Table/List */}
                        <div>
                            <h3 className="text-lg font-bold mb-3">User Ratings Details</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {dashboardData.ratingsDetails.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No ratings received yet.</p>
                                ) : (
                                    dashboardData.ratingsDetails.map((item) => (
                                        <div key={item.id} className="border p-4 rounded bg-gray-50 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.User?.name || 'Anonymous User'}</p>
                                                <p className="text-xs text-gray-500">{item.User?.email} | Address: {item.User?.address}</p>
                                            </div>
                                            <div className="bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded">
                                                ⭐ {item.rating} / 5
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    !error && <p className="text-center text-gray-500">Loading your store details...</p>
                )}

            </div>
        </div>
    );
}