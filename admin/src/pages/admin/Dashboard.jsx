import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  Package,
  ShoppingBag,
  Tag,
  LogOut,
  Users,
  ClipboardList,
  UserCircle,
} from "lucide-react";

const AdminDashboard = () => {
  // const [activeTab, setActiveTab] = useState('bookings');
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const MENU_ITEMS = [
    // Admin Only Links
    { to: "bookings", icon: Calendar, label: "All Bookings", roles: ["admin"] },
    { to: "services", icon: Package, label: "Services", roles: ["admin"] },
    {
      to: "shop",
      icon: ShoppingBag,
      label: "Shop Inventory",
      roles: ["admin"],
    },
    { to: "offers", icon: Tag, label: "Offers", roles: ["admin"] },
    { to: "staff", icon: Users, label: "Staff Manager", roles: ["admin"] },

    // Staff Only Links
    {
      to: "my-schedule",
      icon: Calendar,
      label: "My Schedule",
      roles: ["staff"],
    },

    // Shared Links
    {
      to: "notices",
      icon: ClipboardList,
      label: "Notices",
      roles: ["staff", "admin"],
    }, // Both can see, but staff can't edit
    {
      to: "profile",
      icon: UserCircle,
      label: "My Profile",
      roles: ["admin", "staff"],
    },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (!storedUser) {
      navigate("/login");
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const currentPath = location.pathname.split("/")[2] || "";
    if (!currentPath) {
      const firstAllowed = MENU_ITEMS.find((item) =>
        item.roles.includes(parsedUser.role),
      );
      if (firstAllowed) navigate(firstAllowed.to);
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  if (!user) return null; // Prevents flickering


  return (
        <div className="flex h-screen bg-cream selection:bg-brown-900 selection:text-white">
            {/* Sidebar */}
            <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-brown-100 flex flex-col">
                <div className="h-24 flex items-center justify-center border-b border-brown-100/50">
                    <h1 className="text-3xl font-serif text-brown-900 tracking-tight">Qesh</h1>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <p className="px-4 text-xs font-bold text-brown-400 uppercase tracking-widest mb-4">Menu</p>
                    
                    {/* Filter Menu Items based on Role */}
                    {MENU_ITEMS.filter(item => item.roles.includes(user.role)).map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex w-full items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                                    isActive
                                        ? 'bg-brown-900 text-white shadow-lg shadow-brown-900/20 translate-x-1'
                                        : 'text-brown-600 hover:bg-brown-100 hover:text-brown-900'
                                }`
                            }
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            <span className="tracking-wide">{item.label}</span>
                        </NavLink>
                    ))}
                    
                    <div className="my-8 border-t border-brown-100/50"></div>
                </nav>

                <div className="p-4 border-t border-brown-100/50">
                    <button onClick={handleLogout} className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50">
                        <LogOut className="mr-3 h-5 w-5" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-cream">
                <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-brown-900/5 bg-cream/80 px-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-serif text-brown-900 capitalize">
                        {location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-brown-100">
                        <div className="h-8 w-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-900 font-bold">
                            {user.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-brown-900">{user.name} ({user.role})</span>
                    </div>
                </header>

                <main className="p-8 mx-auto max-w-7xl animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
