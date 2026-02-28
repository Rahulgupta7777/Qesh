import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import api from '../../utils/api';

const OffersManager = () => {
    const [offers, setOffers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        type: 'percentage', // or flat
        value: '',
        isActive: true
    });

    const fetchOffers = async () => {
        try {
            const res = await api.offers.getAll();
            setOffers(res.data);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.offers.create(formData);
            setIsModalOpen(false);
            setFormData({ title: '', code: '', type: 'percentage', value: '', isActive: true });
            fetchOffers();
        } catch (error) {
            console.error('Error saving offer:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this offer?')) return;
        try {
            await api.offers.delete(id);
            fetchOffers();
        } catch (error) {
            console.error('Error deleting offer:', error);
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Manage Offers</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Offer
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {offers.map((offer) => (
                    <div key={offer._id} className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-xl">{offer.title}</h3>
                                <p className="mt-1 font-mono text-sm text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded">{offer.code}</p>
                                <div className="mt-4">
                                    <span className="text-2xl font-bold text-green-600">
                                        {offer.type === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(offer._id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">Create New Offer</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Offer Title (e.g. Diwali Dhamaka)"
                                className="w-full rounded-lg border p-2"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Coupon Code (e.g. DIWALI20)"
                                className="w-full rounded-lg border p-2 uppercase"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="w-full rounded-lg border p-2"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="flat">Flat Amount (₹)</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Value"
                                    className="w-full rounded-lg border p-2"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full rounded-lg bg-black py-2 text-white font-bold">
                                Create Offer
                            </button> 
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OffersManager;
