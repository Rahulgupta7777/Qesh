import React, { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../../utils/api';

const StaffNotices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await api.staffPortal.getNotices();
                setNotices(res.data);
            } catch (error) {
                console.error("Error fetching notices", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'urgent': return <AlertTriangle className="h-6 w-6 text-red-500" />;
            case 'success': return <CheckCircle className="h-6 w-6 text-green-500" />;
            default: return <Info className="h-6 w-6 text-blue-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'urgent': return 'bg-red-50 border-red-100';
            case 'success': return 'bg-green-50 border-green-100';
            default: return 'bg-blue-50 border-blue-100';
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-serif text-brown-900 font-bold">Notice Board</h2>
                <p className="text-brown-500">Updates and announcements from management</p>
            </div>

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
                            className={`p-6 rounded-2xl border flex gap-4 ${getBgColor(notice.type)}`}
                        >
                            <div className="shrink-0 mt-1">
                                {getIcon(notice.type)}
                            </div>
                            <div>
                                <p className="text-gray-800 font-medium leading-relaxed">
                                    {notice.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Posted on {new Date(notice.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffNotices;