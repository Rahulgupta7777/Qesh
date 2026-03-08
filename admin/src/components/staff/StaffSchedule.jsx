import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, MapPin } from 'lucide-react';
import api from '../../utils/api';

const StaffSchedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, [selectedDate]);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const res = await api.staffPortal.getSchedule(selectedDate);
            setAppointments(res.data);
        } catch (error) {
            console.error("Error fetching schedule", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (!window.confirm(`Mark this appointment as ${newStatus}?`)) return;
        try {
            await api.staffPortal.updateStatus(id, newStatus);
            fetchSchedule(); // Refresh list
        } catch (error) {
            console.error("Status update failed", error.response);
            alert(`Failed to update status: ${error.response?.data?.message || "Unknown error"}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header & Date Picker */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-brown-100">
                <div>
                    <h2 className="text-2xl font-serif text-brown-900 font-bold">My Schedule</h2>
                    <p className="text-brown-500">Manage your upcoming appointments</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-brown-600" />
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="p-2 border border-brown-200 rounded-lg text-brown-900 focus:ring-2 focus:ring-brown-500 outline-none"
                    />
                </div>
            </div>

            {/* Appointments List */}
            {loading ? (
                <div className="text-center py-12 text-brown-400">Loading schedule...</div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-brown-200">
                    <p className="text-brown-500 font-medium">No appointments scheduled for this date.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div key={apt._id} className="bg-white p-6 rounded-2xl shadow-sm border border-brown-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                {/* Time & Service Info */}
                                <div className="flex gap-6">
                                    <div className="flex flex-col items-center justify-center min-w-[80px] bg-brown-50 rounded-xl p-3 text-brown-900">
                                        <Clock className="h-5 w-5 mb-1" />
                                        <span className="font-bold text-lg leading-none">{apt.timeSlot.split(' ')[0]}</span>
                                        <span className="text-xs font-bold uppercase">{apt.timeSlot.split(' ')[1]}</span>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-xl font-bold text-brown-900 mb-1">
                                            {apt.services.map(s => s.serviceId.name).join(', ')}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-brown-600 mt-2">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                {apt.userId?.name || "Walk-in Guest"}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                Salon Floor
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Actions */}
                                <div className="flex items-center gap-3">
                                    {apt.status === 'confirmed' ? (
                                        <>
                                            <button 
                                                onClick={() => handleStatusUpdate(apt._id, 'completed')}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition-colors"
                                            >
                                                <CheckCircle className="h-4 w-4" /> Complete
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(apt._id, 'noshow')}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors"
                                            >
                                                <XCircle className="h-4 w-4" /> No Show
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`px-4 py-2 rounded-lg font-bold capitalize ${
                                            apt.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                            apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {apt.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffSchedule;