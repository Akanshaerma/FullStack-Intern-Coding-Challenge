import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'normal_user' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.name.length < 3 || formData.name.length > 50) {
        return setError('Name must be between 3 and 50 characters.');
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(formData.password)) {
            return setError('Password must be 8-16 chars, include 1 uppercase & 1 special character.');
        }
        if (formData.address.length > 400) {
            return setError('Address cannot exceed 400 characters.');
        }

        try {
            await API.post('/auth/signup', formData);
            alert('Signup successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                
                <input type="text" name="name" placeholder="Full Name (Min 3 chars)" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
                <input type="password" name="password" placeholder="Password (8-16 chars, 1 Upper, 1 Special)" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
                <textarea name="address" placeholder="Address (Max 400 chars)" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
                
                <select name="role" onChange={handleChange} className="w-full p-2 mb-4 border rounded">
                    <option value="normal_user">Normal User</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="admin">System Administrator</option>
                </select>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Sign Up</button>
                <p className="mt-4 text-sm text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
            </form>
        </div>
    );
}