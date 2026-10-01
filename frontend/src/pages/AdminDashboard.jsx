import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { validateUserForm } from '../utils/validation';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortByField, setSortByField] = useState('name');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'Normal User'
    });

    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchData = async () => {
        try {
            const statsRes = await API.get('/admin/stats');
            setStats(statsRes.data);

            const usersRes = await API.get(`/admin/users?search=${search}&role=${roleFilter}`);
            let fetchedUsers = usersRes.data;

            fetchedUsers.sort((a, b) => {
                let valA = a[sortByField] ? String(a[sortByField]).toLowerCase() : '';
                let valB = b[sortByField] ? String(b[sortByField]).toLowerCase() : '';

                if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });

            setUsers(fetchedUsers);
        } catch (err) {
            setError('Failed to fetch admin dashboard data.');
        }
    };

    useEffect(() => {
        fetchData();
    }, [search, roleFilter]);

    const handleSort = (field) => {
        const newOrder = sortByField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortByField(field);
        setSortOrder(newOrder);

        const sortedUsers = [...users].sort((a, b) => {
            let valA = a[field] ? String(a[field]).toLowerCase() : '';
            let valB = b[field] ? String(b[field]).toLowerCase() : '';

            if (valA < valB) return newOrder === 'asc' ? -1 : 1;
            if (valA > valB) return newOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setUsers(sortedUsers);
    };

    
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        
        const validationError = validateUserForm(formData);
        if (validationError) {
            setError(validationError);
            return;
        }

        
        try {
            await API.post('/admin/users', formData);
            setSuccessMessage('User created successfully!');
            setFormData({ name: '', email: '', password: '', address: '', role: 'Normal User' });
            fetchData(); 
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create user.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="bg-white p-6 rounded shadow-md flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">System Administrator Panel</h1>
                        <p className="text-sm text-gray-600">Welcome, {adminUser.name || 'Admin'}</p>
                    </div>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
                {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded">{successMessage}</div>}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded shadow-md border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-5 rounded shadow-md border-l-4 border-green-500">
                        <p className="text-sm text-gray-500">Total Stores</p>
                        <p className="text-2xl font-bold">{stats.totalStores}</p>
                    </div>
                    <div className="bg-white p-5 rounded shadow-md border-l-4 border-yellow-500">
                        <p className="text-sm text-gray-500">Total Ratings</p>
                        <p className="text-2xl font-bold">{stats.totalRatings}</p>
                    </div>
                </div>

                {/* Add New User Section */}
                <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-lg font-bold mb-4">Add New User / Store Owner / Admin</h2>
                    <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="border p-2 rounded" required />
                        <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border p-2 rounded" required />
                        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="border p-2 rounded" required />
                        <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="border p-2 rounded" required />
                        <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="border p-2 rounded">
                            <option value="Normal User">Normal User</option>
                            <option value="Store Owner">Store Owner</option>
                            <option value="System Administrator">System Administrator</option>
                        </select>
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 md:col-span-2">Create User</button>
                    </form>
                </div>

                {/* Manage Users & Filters */}
                <div className="bg-white p-6 rounded shadow-md space-y-4">
                    <h2 className="text-lg font-bold">Manage Users & Filters</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input type="text" placeholder="Search by name, email, or address..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded flex-1" />
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border p-2 rounded">
                            <option value="">All Roles</option>
                            <option value="Normal User">Normal User</option>
                            <option value="Store Owner">Store Owner</option>
                            <option value="System Administrator">System Administrator</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-3 border cursor-pointer hover:bg-gray-300" onClick={() => handleSort('name')}>
                                        Name {sortByField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th className="p-3 border cursor-pointer hover:bg-gray-300" onClick={() => handleSort('email')}>
                                        Email {sortByField === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th className="p-3 border">Address</th>
                                    <th className="p-3 border cursor-pointer hover:bg-gray-300" onClick={() => handleSort('role')}>
                                        Role {sortByField === 'role' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center p-4 text-gray-500">No users found.</td></tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="p-3 border">{u.name}</td>
                                            <td className="p-3 border">{u.email}</td>
                                            <td className="p-3 border">{u.address}</td>
                                            <td className="p-3 border font-semibold">{u.role}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}