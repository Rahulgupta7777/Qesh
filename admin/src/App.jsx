import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

import BookingsView from "./components/admin/BookingsView";
import ServicesManager from "./components/admin/ServicesManager";
import ShopManager from "./components/admin/ShopManager";
import OffersManager from "./components/admin/OffersManager";
import StaffManager from "./components/admin/StaffManager";
import NoticesBoard from "./components/common/NoticeBoard";

import StaffSchedule from "./components/staff/StaffSchedule";
import UserProfile from "./components/common/UserProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<AdminDashboard />}>
        {/* "index" means this shows up when url is just /dashboard */}
        <Route index element={<BookingsView />} />

        <Route path="bookings" element={<BookingsView />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="shop" element={<ShopManager />} />
        <Route path="offers" element={<OffersManager />} />
        <Route path="staff" element={<StaffManager />} />

        {/* Staff Routes */}
        <Route path="my-schedule" element={<StaffSchedule />} />
        <Route path="notices" element={<NoticesBoard />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
