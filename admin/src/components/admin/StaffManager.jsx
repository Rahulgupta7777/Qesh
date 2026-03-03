import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  User,
  Mail,
  Phone,
  Scissors,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import api from "../../utils/api";

const StaffManager = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "stylist",
    specialization: "", 
    password: "", 
    isActive: true,
  });

  // Roles matching Mongoose Schema
  const ROLES = [
    { value: "salon_manager", label: "Salon Manager" },
    { value: "assistant_manager", label: "Assistant Manager" },
    { value: "stylist", label: "Stylist" },
    { value: "beautician", label: "Beautician" },
    { value: "makeup_artist", label: "Makeup Artist" },
    { value: "receptionist", label: "Receptionist" },
    { value: "helper", label: "Helper" },
  ];

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.staff.getAll();
      setStaffList(res.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openModal = (staff = null) => {
    setShowPassword(false); 
    if (staff) {
      setEditingStaff(staff);
      setFormData({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        specialization: staff.specialization.join(", "), // Array to String
        password: "", 
        isActive: staff.isActive,
      });
    } else {
      setEditingStaff(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "stylist",
        specialization: "",
        password: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare Payload
    const payload = {
      ...formData,
      // Converting comma string back to array
      specialization: formData.specialization
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
    };

    // Remove password if empty during edit (so password doesn't get overwrite with empty string)
    if (editingStaff && !payload.password) {
      delete payload.password;
    }

    try {
      if (editingStaff) {
        await api.staff.update(editingStaff._id, payload);
      } else {
        await api.staff.create(payload);
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (error) {
      console.error("Error saving staff:", error);
      alert(`Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this staff member? This will disable their login access.",
      )
    )
      return;
    try {
      await api.staff.delete(id);
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-brown-900">
            Staff Management
          </h2>
          <p className="text-brown-600 mt-1">
            Manage employees, roles, and login credentials.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center rounded-xl bg-brown-900 px-6 py-3 text-white shadow-lg hover:bg-brown-800 transition-all hover:shadow-xl active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Staff
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => (
          <div
            key={staff._id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-brown-100 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brown-50 rounded-xl text-brown-900 group-hover:bg-brown-900 group-hover:text-white transition-colors">
                <User className="h-6 w-6" />
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${staff.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {staff.isActive ? "Active" : "On Leave"}
              </div>
            </div>

            <h3 className="text-xl font-bold text-brown-900 mb-1">
              {staff.name}
            </h3>
            <p className="text-brown-500 font-medium text-sm uppercase tracking-wide mb-4">
              {staff.role.replace("_", " ")}
            </p>

            <div className="space-y-2 text-sm text-brown-700 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brown-400" />
                <span>{staff.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brown-400" />
                <span>{staff.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <Scissors className="h-4 w-4 text-brown-400 mt-0.5" />
                <span className="line-clamp-1">
                  {staff.specialization.length > 0
                    ? staff.specialization.join(", ")
                    : "No specialization"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-brown-50">
              <button
                onClick={() => openModal(staff)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brown-200 text-brown-700 hover:bg-brown-50 font-medium transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(staff._id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 font-medium transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brown-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-brown-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-serif font-bold">
                  {editingStaff ? "Edit Staff Member" : "Hire New Staff"}
                </h3>
                <p className="text-brown-200 text-sm mt-1">
                  {editingStaff
                    ? "Update details or reset password"
                    : "Create profile and login credentials"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto">
              <form
                id="staffForm"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brown-500">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border-2 border-brown-100 p-3 font-medium text-brown-900 outline-none focus:border-brown-900 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brown-500">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-xl border-2 border-brown-100 p-3 font-medium text-brown-900 outline-none focus:border-brown-900 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Login Credentials */}
                <div className="p-6 bg-brown-50 rounded-2xl space-y-4 border border-brown-100">
                  <div className="flex items-center gap-2 text-brown-900 font-bold border-b border-brown-200 pb-2 mb-2">
                    <Shield className="h-4 w-4" />
                    Login Credentials
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-brown-500">
                        Email (Login ID)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="staff@salon.com"
                        className="w-full rounded-xl border border-brown-200 bg-white p-3 text-brown-900 outline-none focus:border-brown-900 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-brown-500">
                        {editingStaff ? "New Password (Optional)" : "Password"}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder={
                            editingStaff
                              ? "Leave blank to keep current"
                              : "Set login password"
                          }
                          className="w-full rounded-xl border border-brown-200 bg-white p-3 pr-10 text-brown-900 outline-none focus:border-brown-900 transition-all"
                          required={!editingStaff} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-brown-400 hover:text-brown-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brown-500">
                      Job Role
                    </label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full appearance-none rounded-xl border-2 border-brown-100 bg-transparent p-3 font-medium text-brown-900 outline-none focus:border-brown-900 transition-all"
                      >
                        {ROLES.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-brown-500">
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brown-500">
                      Active Status
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-brown-100 cursor-pointer hover:bg-brown-50 transition-all">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded text-brown-900 focus:ring-brown-900"
                      />
                      <span className="font-medium text-brown-900">
                        Staff is currently working
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brown-500">
                    Specializations
                  </label>
                  <input
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="e.g. Hair Coloring, Spa, Nail Art (Comma separated)"
                    className="w-full rounded-xl border-2 border-brown-100 p-3 font-medium text-brown-900 outline-none focus:border-brown-900 transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-brown-50 border-t border-brown-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-xl border border-brown-200 text-brown-600 font-bold hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="staffForm"
                className="px-8 py-3 rounded-xl bg-brown-900 text-white font-bold shadow-lg hover:bg-brown-800 transition-all hover:shadow-xl active:scale-95"
              >
                {editingStaff ? "Save Changes" : "Hire Staff Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManager;
