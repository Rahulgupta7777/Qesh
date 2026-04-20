import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import BookingModal from "../components/booking/BookingModal";
import { Calendar, Clock, MapPin, Phone, User, Scissors } from "lucide-react";
import api from "../../utils/api.js";
import { useBooking } from "../context/BookingContext";

const Schedule = () => {
  const { user, fetchActiveBooking } = useBooking();
  const [appointments, setAppointments] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return setLoading(false);
    try {
      const res = await api.bookings.getMyBookings(user.token);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user, isBookingOpen]); // Refresh when user logs in or booking modal closes

  return (
    <div className="min-h-screen bg-cream text-brown-900 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col">
        <Navbar showLogo={true} onOpenBooking={() => setIsBookingOpen(true)} />
        <div className="w-full h-px bg-beige-300 mb-8 md:mb-12"></div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedServices={[]}
      />

      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-brown-900 mb-4">
            Your Visits
          </h1>
          <p className="text-brown-600">
            Manage your past and upcoming appointments at Qesh.
          </p>
        </div>

        {!user ? (
          <div className="text-center py-10">
            <p className="text-xl font-serif text-brown-500 mb-4">
              Please login to view your upcoming visits.
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="neu-btn text-brown-900 px-8 py-3 rounded-full font-medium"
            >
              Login / Book Now
            </button>
          </div>
        ) : loading ? (
          <p className="text-center text-brown-400 animate-pulse">
            Loading visits...
          </p>
        ) : appointments.length === 0 ? (
          <div className="neu-raised rounded-3xl p-12 text-center">
            <div className="w-20 h-20 neu-pressed text-brown-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar size={28} />
            </div>
            <h3 className="font-serif text-2xl text-brown-900 mb-2">
              No Upcoming Visits
            </h3>
            <p className="text-brown-600 mb-8 max-w-sm mx-auto">
              You haven't scheduled any appointments with us yet. Book your
              session to experience luxury.
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="neu-btn text-brown-900 px-8 py-3 rounded-full font-medium"
            >
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Active Bookings Section */}
            {appointments.some((a) =>
              ["confirmed", "booked", "pending"].includes(a.status),
            ) && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-serif text-brown-900 border-b border-brown-900/10 pb-2">
                    Upcoming Visits
                  </h2>
                  {appointments
                    .filter((a) =>
                      ["confirmed", "booked", "pending"].includes(a.status),
                    )
                    .map((appt) => (
                      <AppointmentCard
                        key={appt._id}
                        appt={appt}
                        user={user}
                        onCancel={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to cancel this appointment?",
                            )
                          ) {
                            try {
                              await api.bookings.cancel(appt._id);
                              fetchBookings();
                              fetchActiveBooking();
                            } catch (err) {
                              console.error("Failed to cancel", err);
                              alert("Failed to cancel appointment");
                            }
                          }
                        }}
                      />
                    ))}
                </div>
              )}

            {/* Completed Bookings Section */}
            {appointments.some((a) => a.status === "completed") && (
              <div className="space-y-8 opacity-90">
                <h2 className="text-2xl font-serif text-brown-900 border-b border-brown-900/10 pb-2">
                  Completed Visits
                </h2>
                {appointments
                  .filter((a) => a.status === "completed")
                  .map((appt) => (
                    <AppointmentCard
                      key={appt._id}
                      appt={appt}
                      user={user}
                      isPast={true}
                    />
                  ))}
              </div>
            )}

            {/* Cancelled Bookings Section */}
            {appointments.some((a) => a.status === "cancelled") && (
              <div className="space-y-8 opacity-75 grayscale-[0.5]">
                <h2 className="text-2xl font-serif text-brown-900 border-b border-brown-900/10 pb-2">
                  Cancelled Visits
                </h2>
                {appointments
                  .filter((a) => a.status === "cancelled")
                  .map((appt) => (
                    <AppointmentCard
                      key={appt._id}
                      appt={appt}
                      user={user}
                      isPast={true}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Extracted Card Component for Cleanliness
const AppointmentCard = ({ appt, user, onCancel, isPast }) => {
  return (
    <div className="neu-raised rounded-3xl p-8 animate-fade-in relative overflow-hidden">
      <div
        className={`absolute top-0 left-0 w-full h-2 ${appt.status === "cancelled"
            ? "bg-gray-300"
            : appt.status === "completed"
              ? "bg-brown-900"
              : "bg-gradient-to-r from-brown-400 to-brown-900"
          }`}
      ></div>

      <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center mb-8 border-b border-brown-900/10 pb-8">
        <div>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3 inline-block neu-chip ${appt.status === "confirmed" || appt.status === "booked"
                ? "text-green-800"
                : appt.status === "cancelled"
                  ? "text-red-700"
                  : "text-brown-700"
              }`}
          >
            {appt.status}
          </span>
          <h2 className="text-2xl font-serif text-brown-900">
            {appt.status === "completed"
              ? "Past Visit"
              : appt.status === "cancelled"
                ? "Cancelled Visit"
                : "Upcoming Appointment"}
          </h2>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-brown-500">Booking Reference</p>
          <p className="font-mono text-lg text-brown-900">
            #{appt._id.slice(-6).toUpperCase()}
          </p>
          {!isPast &&
            (appt.status === "confirmed" || appt.status === "booked") && (
              <button
                onClick={onCancel}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Cancel Appointment
              </button>
            )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full neu-pressed flex items-center justify-center text-brown-700 shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-brown-400 uppercase tracking-wider mb-1">
                Date
              </p>
              <p className="text-lg font-medium text-brown-900">
                {new Date(appt.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full neu-pressed flex items-center justify-center text-brown-700 shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-brown-400 uppercase tracking-wider mb-1">
                Time
              </p>
              <p className="text-lg font-medium text-brown-900">
                {appt.timeSlot}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full neu-pressed flex items-center justify-center text-brown-700 shrink-0">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-brown-400 uppercase tracking-wider mb-1">
                Guest
              </p>
              <p className="text-lg font-medium text-brown-900">{user.name}</p>
              <p className="text-sm text-brown-600 mt-1">{user.phone}</p>
            </div>
          </div>
        </div>

        <div className="neu-inset rounded-2xl p-6">
          <h3 className="flex items-center gap-2 font-serif text-lg text-brown-900 mb-6 border-b border-brown-900/10 pb-4">
            <Scissors size={18} /> Services
          </h3>
          <div className="space-y-3">
            {appt.services && appt.services.length > 0 ? (
              appt.services.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brown-400"></div>
                  <span className="text-brown-800">
                    {s.serviceId?.name || "Service"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-brown-500 italic">
                No specific services selected
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
