import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../utils/api';

const ShopManager = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: 0,
        image: ''
    });

    const fetchProducts = async () => {
        try {
            const res = await api.products.getAll();
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                await api.products.update(editingProduct._id, formData);
            } else {
                await api.products.create(formData);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', category: '', price: '', stock: 0, image: '' });
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.products.delete(id);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({ name: '', category: '', price: '', stock: 0, image: '' });
        }
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Manage Shop</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product._id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        {product.image && (
                            <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
                        )}
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{product.name}</h3>
                                    <p className="text-sm text-gray-500">{product.category}</p>
                                </div>
                                <span className="font-bold">₹{product.price}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <div className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-2">
                                <button onClick={() => openModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Product Name"
                                className="w-full rounded-lg border p-2"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Category"
                                className="w-full rounded-lg border p-2"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Price (INR)"
                                    className="w-full rounded-lg border p-2"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Stock Qty"
                                    className="w-full rounded-lg border p-2"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>
                            <input
                                placeholder="Image URL"
                                className="w-full rounded-lg border p-2"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                            <button type="submit" className="w-full rounded-lg bg-black py-2 text-white font-bold">
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopManager;
