import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Phone, Briefcase, Save, X, Edit2, Key } from 'lucide-react';
import api from '../../utils/api';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '' // Only send if changing
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setProfile(user);
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                password: ''
            });
        }
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                phone: formData.phone
            };
            if (formData.password) payload.password = formData.password;

            // Call the API
            const res = await api.profile.update(payload);
            
            // Update Local State & Storage
            const updatedUser = { ...profile, ...res.data.user };
            setProfile(updatedUser);
            localStorage.setItem('adminUser', JSON.stringify(updatedUser));
            
            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: '' })); // Clear password field
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed", error.response );
            alert(`Failed to update profile: ${error.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <div>Loading...</div>;

    // RULE: Only Admins can edit. Staff get Read-Only view.
    const canEdit = profile.role === 'admin';

    return (
        <div className="max-w-2xl mx-auto">
             <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-serif text-brown-900 font-bold">My Profile</h2>
                    <p className="text-brown-500">Manage your personal information</p>
                </div>
                
                {/* CONDITIONAL BUTTON: Only visible if Admin */}
                {canEdit && !isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-brown-900 font-bold hover:bg-white px-4 py-2 rounded-xl transition-all"
                    >
                        <Edit2 className="h-4 w-4" /> Edit Profile
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-lg shadow-brown-900/5 border border-brown-100 overflow-hidden">
                {/* Cover Banner */}
                <div className="h-32 bg-brown-900"></div>
                
                <div className="px-8 pb-8">
                    {/* Avatar */}
                    <div className="relative -mt-12 mb-6">
                        <div className="h-24 w-24 rounded-full bg-white p-1 inline-block">
                            <div className="h-full w-full rounded-full bg-brown-100 flex items-center justify-center text-brown-900 font-serif font-bold text-3xl">
                                {profile.name?.charAt(0)}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* NAME FIELD */}
                        <div className="flex items-center gap-4 p-4 bg-brown-50/50 rounded-xl border border-brown-100">
                            <div className="p-2 bg-white rounded-lg text-brown-600">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-brown-400 uppercase tracking-widest mb-1">Full Name</p>
                                {isEditing ? (
                                    <input 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full p-2 rounded-lg border border-brown-200 outline-none focus:border-brown-900"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-brown-900">{profile.name}</p>
                                )}
                            </div>
                        </div>

                        {/* EMAIL (Always Read-Only) */}
                        <div className="flex items-center gap-4 p-4 bg-brown-50/50 rounded-xl border border-brown-100">
                            <div className="p-2 bg-white rounded-lg text-brown-600">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-brown-400 uppercase tracking-widest">Email Address</p>
                                <p className="text-lg font-medium text-brown-900">{profile.email}</p>
                                {isEditing && <p className="text-xs text-red-400 mt-1">Email cannot be changed</p>}
                            </div>
                        </div>

                        {/* PHONE FIELD */}
                        <div className="flex items-center gap-4 p-4 bg-brown-50/50 rounded-xl border border-brown-100">
                            <div className="p-2 bg-white rounded-lg text-brown-600">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-brown-400 uppercase tracking-widest mb-1">Phone</p>
                                {isEditing ? (
                                    <input 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full p-2 rounded-lg border border-brown-200 outline-none focus:border-brown-900"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-brown-900">{profile.phone || 'Not set'}</p>
                                )}
                            </div>
                        </div>

                        {/* PASSWORD FIELD (Only visible when editing) */}
                        {isEditing && (
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-brown-100">
                                <div className="p-2 bg-brown-50 rounded-lg text-brown-600">
                                    <Key className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-brown-400 uppercase tracking-widest mb-1">New Password</p>
                                    <input 
                                        type="password"
                                        placeholder="Leave blank to keep current"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full p-2 rounded-lg border border-brown-200 outline-none focus:border-brown-900"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ROLE (Read-Only) */}
                        <div className="flex items-center gap-4 p-4 bg-brown-50/50 rounded-xl border border-brown-100">
                            <div className="p-2 bg-white rounded-lg text-brown-600">
                                {profile.role === 'admin' ? <Shield className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brown-400 uppercase tracking-widest">Role</p>
                                <p className="text-lg font-medium text-brown-900 capitalize">{profile.role.replace('_', ' ')}</p>
                            </div>
                        </div>

                        {/* ACTION BUTTONS (Only when editing) */}
                        {isEditing && (
                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-3 rounded-xl border border-brown-200 text-brown-600 font-bold hover:bg-brown-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl bg-brown-900 text-white font-bold hover:bg-brown-800 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;