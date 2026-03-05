import React, { useState, useEffect } from 'react';
import { 
    Bell, Info, AlertTriangle, CheckCircle, 
    Plus, Trash2, Edit2, X, Save 
} from 'lucide-react';
import api from '../../utils/api';

const NoticesBoard = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Form State (For Admins)
    const [isEditing, setIsEditing] = useState(null); // ID of notice being edited
    const [formData, setFormData] = useState({
        message: '',
        type: 'info' // info, urgent, success, warning
    });

    useEffect(() => {
        // Check Role
        const user = JSON.parse(localStorage.getItem('adminUser'));
        const adminRole = user?.role === 'admin';
        setIsAdmin(adminRole);

        fetchNotices(adminRole);
    }, []);

    const fetchNotices = async (isUserAdmin) => {
        try {
            setLoading(true);
            // Choose API based on Role
            const res = isUserAdmin 
                ? await api.notices.getAll() 
                : await api.staffPortal.getNotices();
                
            setNotices(res.data);
        } catch (error) {
            console.error("Error fetching notices", error);
        } finally {
            setLoading(false);
        }
    };

    // Admin Actions 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.notices.update(isEditing, formData);
            } else {
                await api.notices.create(formData);
            }
            
            // Reset Form
            setFormData({ message: '', type: 'info' });
            setIsEditing(null);
            fetchNotices(true); // Refresh list
        } catch (error) {
            alert(`Failed to ${isEditing ? 'update' : 'create'} notice.`);
        }
    };

    const handleEditClick = (notice) => {
        setIsEditing(notice._id);
        setFormData({
            message: notice.message,
            type: notice.type
        });
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
        setFormData({ message: '', type: 'info' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this notice?")) return;
        try {
            await api.notices.delete(id);
            fetchNotices(true);
        } catch (error) {
            alert("Failed to delete notice.");
        }
    };

    // --- UI Helpers ---

    const getIcon = (type) => {
        switch (type) {
            case 'urgent': return <AlertTriangle className="h-6 w-6 text-red-500" />;
            case 'success': return <CheckCircle className="h-6 w-6 text-green-500" />;
            case 'warning': return <AlertTriangle className="h-6 w-6 text-orange-500" />;
            default: return <Info className="h-6 w-6 text-blue-500" />;
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'urgent': return 'bg-red-50 border-red-100';
            case 'success': return 'bg-green-50 border-green-100';
            case 'warning': return 'bg-orange-50 border-orange-100';
            default: return 'bg-blue-50 border-blue-100';
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-serif text-brown-900 font-bold">Notice Board</h2>
                    <p className="text-brown-500">
                        {isAdmin ? 'Manage announcements for your team' : 'Updates and announcements from management'}
                    </p>
                </div>
            </div>

            {/* ADMIN: Create/Edit Form */}
            {isAdmin && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-brown-100 mb-8">
                    <h3 className="font-bold text-brown-900 mb-4 flex items-center gap-2">
                        {isEditing ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {isEditing ? 'Edit Notice' : 'Post New Notice'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="p-3 rounded-xl border border-brown-200 outline-none focus:border-brown-900 bg-white"
                            >
                                <option value="info"> Info</option>
                                <option value="success"> Success</option>
                                <option value="warning"> Warning</option>
                                <option value="urgent"> Urgent</option>
                            </select>
                            
                            <input
                                placeholder="Write your announcement here..."
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                className="flex-1 p-3 rounded-xl border border-brown-200 outline-none focus:border-brown-900"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            {isEditing && (
                                <button 
                                    type="button" 
                                    onClick={handleCancelEdit}
                                    className="px-6 py-2 rounded-xl border border-brown-200 text-brown-600 font-bold hover:bg-brown-50"
                                >
                                    Cancel
                                </button>
                            )}
                            <button 
                                type="submit" 
                                className="px-8 py-2 rounded-xl bg-brown-900 text-white font-bold hover:bg-brown-800 flex items-center gap-2"
                            >
                                {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                {isEditing ? 'Update Notice' : 'Post Notice'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List of Notices */}
            {loading ? (
                <p className="text-center text-brown-400">Loading notices...</p>
            ) : notices.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-brown-100">
                    <Bell className="h-12 w-12 text-brown-200 mx-auto mb-3" />
                    <p className="text-brown-500">No active notices at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notices.map((notice) => (
                        <div 
                            key={notice._id} 
                            className={`p-6 rounded-2xl border flex gap-4 ${getStyles(notice.type)} relative group`}
                        >
                            <div className="shrink-0 mt-1">
                                {getIcon(notice.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900 font-medium leading-relaxed">
                                    {notice.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2 font-medium">
                                    Posted on {new Date(notice.createdAt).toLocaleDateString()}
                                    {notice.type === 'urgent' && <span className="ml-2 text-red-600 font-bold uppercase tracking-wider text-[10px]">Urgent</span>}
                                </p>
                            </div>

                            {/* ADMIN: Action Buttons */}
                            {isAdmin && (
                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEditClick(notice)}
                                        className="p-2 bg-white rounded-lg text-brown-600 hover:text-brown-900 shadow-sm hover:shadow-md transition-all"
                                        title="Edit"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(notice._id)}
                                        className="p-2 bg-white rounded-lg text-red-400 hover:text-red-600 shadow-sm hover:shadow-md transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NoticesBoard;