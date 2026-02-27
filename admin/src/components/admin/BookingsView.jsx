import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar, Clock, User, Phone, Loader2, Search, Plus, Edit2,
  XCircle, X, AlertCircle, Scissors, ChevronDown, Check,
  RefreshCw, FileText, BadgeCheck, AlertTriangle, IndianRupee,
  Sparkles
} from "lucide-react";
import api from "../../utils/api";

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4200);
  }, []);
  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

const Toast = ({ toasts, remove }) => (
  <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none">
    {toasts.map((t) => (
      <div key={t.id} className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3.5 rounded-2xl shadow-[0_8px_32px_-8px_rgba(62,39,35,0.12)] text-sm font-semibold border backdrop-blur-xl ${
        t.type === "success" ? "bg-white border-brown-100 text-brown-900"
        : t.type === "error"  ? "bg-white border-rose-100 text-rose-900"
        : "bg-white border-amber-100 text-amber-900"
      }`}>
        {t.type === "success" ? <span className="w-6 h-6 rounded-full bg-brown-900 flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-white" /></span>
         : t.type === "error"  ? <span className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shrink-0"><X className="w-3.5 h-3.5 text-white" /></span>
         : <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shrink-0"><AlertTriangle className="w-3.5 h-3.5 text-white" /></span>}
        {t.message}
        <button onClick={() => remove(t.id)} className="ml-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-brown-50 transition-colors">
          <X className="w-3 h-3 opacity-40" />
        </button>
      </div>
    ))}
  </div>
);

/* ─── Confirm Dialog ─────────────────────────────────────────────────────── */
const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, confirmLabel = "Confirm", danger = false }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-brown-950/30 backdrop-blur-md" onClick={onCancel} />
      <div className="relative bg-[#F9F6F0] rounded-3xl shadow-[0_40px_80px_-20px_rgba(62,39,35,0.22)] border border-brown-100 p-8 w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${danger ? "bg-rose-50" : "bg-brown-100"}`}>
          <AlertTriangle className={`w-5 h-5 ${danger ? "text-rose-500" : "text-brown-600"}`} />
        </div>
        <h3 className="font-serif text-xl font-bold text-brown-900 mb-2">{title}</h3>
        <p className="text-sm text-brown-500 leading-relaxed mb-7">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-full text-sm font-bold text-brown-600 bg-white hover:bg-brown-50 border border-brown-200/60 transition-all">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-3.5 rounded-full text-sm font-bold text-white transition-all active:scale-95 ${danger ? "bg-rose-600 hover:bg-rose-700 shadow-[0_4px_16px_-4px_rgba(225,29,72,0.4)]" : "bg-brown-900 hover:bg-brown-800 shadow-[0_4px_16px_-4px_rgba(62,39,35,0.4)]"}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Status Config (Semantic but Elegant) ───────────────────────────────── */
const STATUS = {
  pending:   { label: "Pending",   pill: "bg-[#FDF8F3] text-[#B45309] border-[#FDE6D5]",  dot: "bg-[#F59E0B]", bar: "#F59E0B" },
  booked:    { label: "Booked",    pill: "bg-[#F2F6F9] text-[#0369A1] border-[#E0F2FE]",  dot: "bg-[#0EA5E9]", bar: "#0EA5E9" },
  confirmed: { label: "Confirmed", pill: "bg-[#F0FDF4] text-[#047857] border-[#DCFCE7]",  dot: "bg-[#10B981]", bar: "#10B981" },
  completed: { label: "Completed", pill: "bg-brown-900 text-white border-brown-900",      dot: "bg-white",     bar: "#3E2723" },
  cancelled: { label: "Cancelled", pill: "bg-[#FFF1F2] text-[#BE123C] border-[#FFE4E6]",  dot: "bg-[#F43F5E]", bar: "#F43F5E" },
  noshow:    { label: "No Show",   pill: "bg-white text-stone-500 border-stone-200",      dot: "bg-stone-400", bar: "#A8A29E" },
};

const StatusPill = ({ status }) => {
  const c = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${c.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

/* ─── Section Label ──────────────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-3 text-brown-400/80">{children}</p>
);

/* ─── Form helpers ───────────────────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-brown-400 block">{label}</label>
    {children}
  </div>
);

const baseInp = "w-full rounded-2xl border border-brown-200/70 bg-white px-4 py-3.5 text-sm font-bold text-brown-900 outline-none focus:border-brown-400 focus:ring-4 focus:ring-brown-100 transition-all placeholder:text-brown-300 placeholder:font-normal shadow-sm";

const Sel = ({ children, ...p }) => (
  <div className="relative">
    <select className={`${baseInp} appearance-none cursor-pointer pr-10`} {...p}>{children}</select>
    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400 pointer-events-none" />
  </div>
);

/* ─── Main ───────────────────────────────────────────────────────────────── */
const BookingsView = () => {
  const { toasts, add: toast, remove: removeToast } = useToast();

  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [filterDate,   setFilterDate]   = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [servicesList, setServicesList] = useState([]);
  const [staffList,    setStaffList]    = useState([]);
  const [editModal,    setEditModal]    = useState({ open: false, booking: null });
  const [createModal,  setCreateModal]  = useState(false);
  const [confirmDlg,   setConfirmDlg]   = useState({ open: false, id: null });
  const [submitting,   setSubmitting]   = useState(false);

  const EMPTY_EDIT   = { staffId: "", timeSlot: "", status: "pending", staffNotes: "" };
  const EMPTY_CREATE = { guestName: "", guestPhone: "", date: "", timeSlot: "", staffId: "", serviceId: "", serviceVariant: "female", totalAmount: "" };
  const [editForm,   setEditForm]   = useState(EMPTY_EDIT);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [bR, sR, stR] = await Promise.all([api.bookings.getAll(), api.services.getAll(), api.staff.getAll()]);
      setBookings(bR.data); setServicesList(sR.data); setStaffList(stR.data);
    } catch { toast("Failed to load bookings.", "error"); }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try { const r = await api.bookings.getAll(); setBookings(r.data); toast("Bookings refreshed."); }
    catch { toast("Refresh failed.", "error"); }
    finally { setRefreshing(false); }
  };

  const openEdit = (b) => {
    setEditForm({ staffId: b.staff?._id || "", timeSlot: b.timeSlot || "", status: b.status || "pending", staffNotes: b.staffNotes || "" });
    setEditModal({ open: true, booking: b });
  };

  const submitEdit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.bookings.update(editModal.booking._id, editForm);
      setEditModal({ open: false, booking: null }); toast("Booking updated.");
      const r = await api.bookings.getAll(); setBookings(r.data);
    } catch (err) { toast(err?.response?.data?.message || "Update failed.", "error"); }
    finally { setSubmitting(false); }
  };

  const submitCreate = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.bookings.create({
        guestDetails: { name: createForm.guestName, phone: createForm.guestPhone },
        date: createForm.date, timeSlot: createForm.timeSlot,
        staffId: createForm.staffId || null,
        services: [{ serviceId: createForm.serviceId, variant: createForm.serviceVariant }],
        products: [], totalAmount: Number(createForm.totalAmount), force: true,
      });
      setCreateModal(false); setCreateForm(EMPTY_CREATE); toast("Walk-in booking created.");
      const r = await api.bookings.getAll(); setBookings(r.data);
    } catch (err) { toast(err?.response?.data?.message || "Creation failed.", "error"); }
    finally { setSubmitting(false); }
  };

  const executeCancel = async () => {
    const id = confirmDlg.id;
    setConfirmDlg({ open: false, id: null });
    try {
      await api.bookings.cancel(id); toast("Booking cancelled.");
      const r = await api.bookings.getAll(); setBookings(r.data);
    } catch (err) { toast(err?.response?.data?.message || "Cancellation failed.", "error"); }
  };

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return bookings
      .filter((b) => {
        const n = (b.userId?.name || "").toLowerCase(), ph = b.userId?.phone || "", id = b._id.toLowerCase();
        return (!term || n.includes(term) || ph.includes(term) || id.includes(term)) &&
               (!filterDate || new Date(b.date).toISOString().split("T")[0] === filterDate) &&
               (filterStatus === "all" || b.status === filterStatus);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [bookings, searchTerm, filterDate, filterStatus]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    let rev = 0, pending = 0;
    bookings.forEach((b) => {
      if (new Date(b.date).toISOString().split("T")[0] === today && b.status === "completed") rev += b.totalAmount;
      if (b.status === "pending" || b.status === "booked") pending++;
    });
    return { total: bookings.length, rev, pending };
  }, [bookings]);

  const hasFilters = searchTerm || filterDate || filterStatus !== "all";
  const clearFilters = () => { setSearchTerm(""); setFilterDate(""); setFilterStatus("all"); };
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  // Avatar palette: strictly Warm Brown / Cream tones
  const avatarColor = (name) => {
    const colors = [
      "bg-[#F5EDE4] text-brown-900 border-brown-200",
      "bg-white text-brown-800 border-brown-200",
      "bg-[#EFE8E0] text-brown-900 border-brown-300",
      "bg-[#E8DCC8] text-brown-900 border-brown-300",
      "bg-brown-50 text-brown-800 border-brown-200",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] pb-28 selection:bg-brown-900 selection:text-white">
      <Toast toasts={toasts} remove={removeToast} />
      <ConfirmDialog
        open={confirmDlg.open} danger
        title="Cancel this appointment?"
        message="This will permanently mark the booking as cancelled and cannot be undone."
        confirmLabel="Yes, Cancel It"
        onConfirm={executeCancel}
        onCancel={() => setConfirmDlg({ open: false, id: null })}
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brown-400 mb-2.5 flex items-center gap-2.5">
            <span className="flex gap-0.5">
              <span className="w-1 h-3 bg-brown-900 rounded-full" />
              <span className="w-1 h-3 bg-brown-400 rounded-full" />
              <span className="w-1 h-3 bg-brown-200 rounded-full" />
            </span>
            Workspace
          </p>
          <h2 className="text-5xl font-serif font-black text-brown-900 tracking-tight leading-none">Appointments</h2>
          <p className="text-brown-500 font-medium mt-2.5 text-sm max-w-xs leading-relaxed">
            Curate and oversee your client scheduling pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold text-brown-700 bg-white border border-brown-200/80 hover:border-brown-400 hover:shadow-md transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setCreateModal(true)}
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-brown-900 hover:bg-brown-800 transition-all shadow-[0_6px_24px_-6px_rgba(62,39,35,0.4)] hover:shadow-[0_10px_30px_-6px_rgba(62,39,35,0.5)] active:scale-[0.97]"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
              <Plus className="w-3 h-3" />
            </div>
            New Walk-in
          </button>
        </div>
      </div>

      {/* ── Stats (Qesh Brand Colors) ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {/* Total Bookings (Dark Brown) */}
        <div className="relative overflow-hidden rounded-[2rem] p-7 shadow-sm hover:shadow-xl transition-all duration-300 group bg-brown-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDB2Nmg2di02aC02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-700" />
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 relative z-10 border border-white/10">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1.5">Total Bookings</p>
          <p className="text-5xl font-serif font-black text-white leading-none">{stats.total}</p>
        </div>

        {/* Revenue (White/Cream) */}
        <div className="relative overflow-hidden rounded-[2rem] p-7 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white border border-brown-100">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-brown-50/50 rounded-full group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-2 right-6 opacity-[0.03] text-[90px] font-serif font-black text-brown-900 select-none leading-none">₹</div>
          <div className="w-12 h-12 bg-brown-50 rounded-2xl flex items-center justify-center mb-6 relative z-10 border border-brown-100">
            <IndianRupee className="w-5 h-5 text-brown-900" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brown-400 mb-1.5">Today's Revenue</p>
          <p className="text-5xl font-serif font-black text-brown-900 leading-none">₹{stats.rev.toLocaleString("en-IN")}</p>
        </div>

        {/* Attention (White/Cream) */}
        <div className="relative overflow-hidden rounded-[2rem] p-7 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white border border-brown-100">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FDF8F3] rounded-full group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-4 right-6 opacity-[0.03] text-[90px] font-serif font-black text-brown-900 select-none leading-none">!</div>
          <div className="w-12 h-12 bg-[#FDF8F3] rounded-2xl flex items-center justify-center mb-6 relative z-10 border border-[#FDE6D5]">
            <AlertCircle className="w-5 h-5 text-[#D97706]" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brown-400 mb-1.5">Needs Attention</p>
          <p className="text-5xl font-serif font-black text-brown-900 leading-none">{stats.pending}</p>
        </div>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[2rem] border border-brown-100/80 shadow-sm px-6 pt-6 pb-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 pointer-events-none" />
            <input
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone or booking ID…"
              className="w-full pl-12 pr-5 py-3.5 rounded-full border border-brown-200/60 bg-[#F9F6F0]/50 text-sm font-bold text-brown-900 placeholder:text-brown-300 placeholder:font-normal outline-none focus:border-brown-400 focus:bg-white focus:ring-4 focus:ring-brown-50 transition-all"
            />
          </div>
          <div className="relative md:w-52">
            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 pointer-events-none" />
            <input
              type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 rounded-full border border-brown-200/60 bg-[#F9F6F0]/50 text-sm font-bold text-brown-900 outline-none focus:border-brown-400 focus:bg-white focus:ring-4 focus:ring-brown-50 transition-all cursor-pointer"
            />
          </div>
          <div className="relative md:w-56">
            <select
              value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none pl-5 pr-12 py-3.5 rounded-full border border-brown-200/60 bg-[#F9F6F0]/50 text-sm font-bold text-brown-900 outline-none focus:border-brown-400 focus:bg-white focus:ring-4 focus:ring-brown-50 transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="booked">Booked</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="noshow">No Show</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400 pointer-events-none" />
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full text-sm font-bold text-brown-600 bg-white hover:bg-brown-50 border border-brown-200/60 transition-colors whitespace-nowrap">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
        <p className="text-xs text-brown-400 font-medium mt-4 px-2">
          Showing&nbsp;<span className="font-black text-brown-900">{filtered.length}</span>&nbsp;of&nbsp;<span className="font-black text-brown-900">{bookings.length}</span>&nbsp;appointments
        </p>
      </div>

      {/* ── Booking Cards ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-brown-100">
          <Loader2 className="w-10 h-10 animate-spin text-brown-300 mb-4" />
          <p className="text-sm text-brown-500 font-semibold">Retrieving records…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-brown-100 text-center px-8">
          <div className="w-20 h-20 rounded-full bg-[#F9F6F0] flex items-center justify-center mb-6"><Search className="w-8 h-8 text-brown-300" /></div>
          <h3 className="font-serif text-3xl font-bold text-brown-900 mb-3">No appointments found</h3>
          <p className="text-sm text-brown-500 max-w-sm leading-relaxed">Try adjusting your filters or search term.</p>
          {hasFilters && <button onClick={clearFilters} className="mt-8 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-brown-900 hover:bg-brown-800 transition-all shadow-md active:scale-95">Clear Filters</button>}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const name = booking.userId?.name || "Walk-in Guest";
            const isCx = booking.status === "cancelled";
            const cfg  = STATUS[booking.status] || STATUS.pending;
            const avCol = avatarColor(name);

            return (
              <div
                key={booking._id}
                className={`group bg-white rounded-[2rem] border overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  isCx
                    ? "border-rose-100/60 opacity-75"
                    : "border-brown-100 hover:border-brown-300/50 hover:shadow-[0_20px_60px_-15px_rgba(62,39,35,0.1)]"
                }`}
              >
                {/* Thin top color bar indicator */}
                <div className="h-1 w-full" style={{ background: cfg.bar }} />

                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1px_1.2fr_1px_1.3fr]">

                  {/* ─── Section 1: Guest ──────────────────────────────── */}
                  <div className="px-7 py-6 bg-[#FDFCFB]">
                    <SectionLabel>Guest</SectionLabel>
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif font-black text-2xl select-none border shadow-sm ${avCol} ${isCx ? "opacity-60 grayscale" : ""}`}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-white" style={{ background: cfg.bar }} />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className={`font-serif font-bold text-lg leading-tight truncate ${isCx ? "line-through text-brown-400" : "text-brown-900"}`}>
                          {name}
                        </p>
                        {booking.userId?.phone && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <Phone className="w-3.5 h-3.5 text-brown-400 shrink-0" />
                            <span className="text-sm font-semibold text-brown-500 tracking-wide">{booking.userId.phone}</span>
                          </div>
                        )}
                        <span className="mt-2.5 inline-block text-[10px] font-black text-brown-500 bg-white px-3 py-1 rounded-full border border-brown-200/80 uppercase tracking-widest shadow-sm">
                          #{booking._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden lg:block bg-brown-50" />

                  {/* ─── Section 2: Appointment ────────────────────────── */}
                  <div className="px-7 py-6 bg-white">
                    <SectionLabel>Appointment</SectionLabel>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#F9F6F0] border border-brown-100 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-brown-600" />
                        </div>
                        <span className={`text-sm font-bold ${isCx ? "text-brown-400" : "text-brown-800"}`}>{fmtDate(booking.date)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#F9F6F0] border border-brown-100 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-brown-600" />
                        </div>
                        <span className={`text-sm font-bold tracking-wide ${isCx ? "text-brown-400" : "text-brown-900"}`}>{booking.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#F9F6F0] border border-brown-100 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-brown-600" />
                        </div>
                        <span className={`text-sm ${booking.staff ? `font-semibold ${isCx ? "text-brown-400" : "text-brown-800"}` : "font-normal italic text-brown-400"}`}>
                          {booking.staff ? booking.staff.name : "Unassigned"}
                        </span>
                      </div>
                      <div className="pt-1">
                        <StatusPill status={booking.status} />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden lg:block bg-brown-50" />

                  {/* ─── Section 3: Services ───────────────────────────── */}
                  <div className="px-7 py-6 bg-[#FDFCFB] flex flex-col justify-between">
                    <div>
                      <SectionLabel>Services</SectionLabel>
                      <div className="space-y-2.5 mb-5">
                        {booking.services?.length > 0 ? booking.services.slice(0, 3).map((svc, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-[#F9F6F0] border border-brown-100 flex items-center justify-center shrink-0">
                              <Scissors className="w-3 h-3 text-brown-500" />
                            </div>
                            <span className={`text-sm font-semibold truncate flex-1 ${isCx ? "text-brown-400 line-through" : "text-brown-800"}`}>
                              {svc.serviceId?.name || "Service"}
                            </span>
                            <span className="text-[9px] uppercase font-black px-2 py-1 rounded-md bg-white border border-brown-200 text-brown-600 shrink-0 shadow-sm">
                              {svc.variant}
                            </span>
                          </div>
                        )) : <p className="text-sm text-brown-400 italic">No services listed</p>}
                        {booking.services?.length > 3 && (
                          <p className="text-xs font-bold text-brown-500 pl-9">+{booking.services.length - 3} more services</p>
                        )}
                      </div>

                      {/* Notes */}
                      {booking.staffNotes && (
                        <div className="flex items-start gap-2 bg-[#FDF8F3] border border-[#FDE6D5] rounded-xl px-4 py-3 mb-4 shadow-sm">
                          <FileText className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                          <p className="text-xs text-[#92400E] leading-relaxed font-semibold line-clamp-2">{booking.staffNotes}</p>
                        </div>
                      )}
                    </div>

                    {/* Amount + actions */}
                    <div className="flex items-end justify-between pt-4 border-t border-brown-100">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brown-400 mb-1">Total</p>
                        <p className={`font-serif text-3xl font-black tracking-tight leading-none ${isCx ? "text-brown-300 line-through" : "text-brown-900"}`}>
                          ₹{booking.totalAmount?.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => openEdit(booking)}
                          title="Edit booking" aria-label="Edit booking"
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-brown-700 bg-white hover:bg-brown-900 hover:text-white transition-all shadow-sm border border-brown-200 hover:border-brown-900"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        {!isCx && (
                          <button
                            onClick={() => setConfirmDlg({ open: true, id: booking._id })}
                            title="Cancel booking" aria-label="Cancel booking"
                            className="flex items-center justify-center w-10 h-10 rounded-full text-rose-500 bg-white hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-200 hover:border-rose-500"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Edit Modal (Ultra-Premium) ─────────────────────────────────────── */}
      {editModal.open && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-brown-950/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setEditModal({ open: false, booking: null })} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(62,39,35,0.3)] border border-brown-200/50 flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-[0.98] duration-500 ease-out">
            {/* Top color indicator based on status */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, transparent, ${STATUS[editForm.status]?.bar || "#A8A29E"}, transparent)` }} />
            
            <div className="px-10 pt-10 pb-6 relative">
              <button onClick={() => setEditModal({ open: false, booking: null })} aria-label="Close" className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center rounded-full bg-[#F9F6F0] text-brown-500 hover:bg-brown-100 hover:text-brown-900 transition-all">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-px bg-brown-300" />
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-brown-400">Modify Booking</p>
              </div>
              <h2 className="font-serif text-4xl font-black text-brown-900 leading-tight mb-2">
                {editModal.booking?.userId?.name || "Walk-in Guest"}
              </h2>
              <div className="flex items-center gap-3 text-sm font-semibold text-brown-500 bg-[#F9F6F0] inline-flex px-4 py-2 rounded-full border border-brown-100">
                <Calendar className="w-4 h-4 text-brown-400" /> {fmtDate(editModal.booking?.date)}
                <span className="text-brown-300">|</span>
                <Clock className="w-4 h-4 text-brown-400" /> {editModal.booking?.timeSlot}
              </div>
            </div>

            <form id="editForm" onSubmit={submitEdit} className="overflow-y-auto px-10 py-4 space-y-7 flex-1">
              <div className="bg-[#F9F6F0]/50 p-6 rounded-3xl border border-brown-50 space-y-6">
                <Field label="Status Update">
                  <Sel value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="booked">Booked (Unpaid)</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="noshow">No Show</option>
                  </Sel>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Assign Staff">
                    <Sel value={editForm.staffId} onChange={(e) => setEditForm({ ...editForm, staffId: e.target.value })}>
                      <option value="">— First Available —</option>
                      {staffList.map((s) => <option key={s._id} value={s._id}>{s.name.split(" ")[0]} ({s.role.replace(/_/g, " ")})</option>)}
                    </Sel>
                  </Field>
                  <Field label="Adjust Time">
                    <input type="text" value={editForm.timeSlot} onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value })} placeholder="10:00 AM" className={baseInp} />
                  </Field>
                </div>
              </div>

              <div>
                <Field label="Administrative Notes">
                  <textarea value={editForm.staffNotes} onChange={(e) => setEditForm({ ...editForm, staffNotes: e.target.value })} rows={3} placeholder="Add color formulas, preferences, or internal notes here…" className={`${baseInp} resize-none bg-amber-50/30 border-amber-100 focus:border-amber-300 focus:ring-amber-50 placeholder:text-amber-700/30`} />
                </Field>
              </div>
            </form>

            <div className="p-8 border-t border-brown-100/60 bg-white flex items-center justify-between gap-4">
              <button type="button" onClick={() => setEditModal({ open: false, booking: null })} className="px-8 py-4 rounded-full text-sm font-bold text-brown-500 hover:text-brown-900 hover:bg-brown-50 transition-colors">
                Discard Changes
              </button>
              <button type="submit" form="editForm" disabled={submitting} className="px-10 py-4 rounded-full text-sm font-bold text-white bg-brown-900 hover:bg-brown-800 transition-all active:scale-95 disabled:opacity-60 shadow-[0_8px_24px_-8px_rgba(62,39,35,0.5)] flex items-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {submitting ? "Saving…" : "Save Updates"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Create Walk-in Modal (Ultra-Premium) ────────────────────────────── */}
      {createModal && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-brown-950/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setCreateModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(62,39,35,0.3)] border border-brown-200/50 flex flex-col max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-[0.98] duration-500 ease-out">
            
            <div className="px-10 pt-10 pb-6 relative bg-gradient-to-br from-[#F9F6F0] to-white border-b border-brown-100">
              <button onClick={() => setCreateModal(false)} aria-label="Close" className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm border border-brown-100 text-brown-500 hover:bg-brown-900 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-brown-400" />
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-brown-400">Walk-in Registry</p>
              </div>
              <h2 className="font-serif text-4xl font-black text-brown-900 leading-tight">New Appointment</h2>
            </div>

            <form id="createForm" onSubmit={submitCreate} className="overflow-y-auto px-10 py-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 align-start">
              
              {/* Left Column */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 rounded-full bg-brown-300" />
                    <h3 className="font-serif text-xl font-bold text-brown-900">Guest Profile</h3>
                  </div>
                  <div className="space-y-4">
                    <Field label="Full Name"><input type="text" required placeholder="Jane Doe" value={createForm.guestName} onChange={(e) => setCreateForm({ ...createForm, guestName: e.target.value })} className={baseInp} /></Field>
                    <Field label="Phone/Mobile"><input type="tel" required placeholder="+91 9XXXXXXXXX" value={createForm.guestPhone} onChange={(e) => setCreateForm({ ...createForm, guestPhone: e.target.value })} className={baseInp} /></Field>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 rounded-full bg-brown-300" />
                    <h3 className="font-serif text-xl font-bold text-brown-900">Schedule</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date"><input type="date" required value={createForm.date} onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })} className={`${baseInp} px-3`} /></Field>
                    <Field label="Time"><input type="text" required placeholder="11:30 AM" value={createForm.timeSlot} onChange={(e) => setCreateForm({ ...createForm, timeSlot: e.target.value })} className={`${baseInp} px-3`} /></Field>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8 flex flex-col">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 rounded-full bg-brown-300" />
                    <h3 className="font-serif text-xl font-bold text-brown-900">Service Plan</h3>
                  </div>
                  <div className="space-y-4">
                    <Field label="Primary Service">
                      <Sel required value={createForm.serviceId} onChange={(e) => setCreateForm({ ...createForm, serviceId: e.target.value })}>
                        <option value="">Choose from catalogue…</option>
                        {servicesList.map((s) => <option key={s._id} value={s._id}>{s.name} (from ₹{s.price})</option>)}
                      </Sel>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Variant">
                        <Sel value={createForm.serviceVariant} onChange={(e) => setCreateForm({ ...createForm, serviceVariant: e.target.value })}>
                          <option value="female">♀ Female</option>
                          <option value="male">♂ Male</option>
                        </Sel>
                      </Field>
                      <Field label="Staff">
                        <Sel value={createForm.staffId} onChange={(e) => setCreateForm({ ...createForm, staffId: e.target.value })}>
                          <option value="">First Available</option>
                          {staffList.map((s) => <option key={s._id} value={s._id}>{s.name.split(" ")[0]}</option>)}
                        </Sel>
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Amount Panel — Distinctive Luxury Invoice feel */}
                <div className="mt-auto">
                  <div className="bg-gradient-to-b from-brown-900 to-brown-950 p-6 rounded-[2rem] relative overflow-hidden shadow-xl border border-brown-800">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/50 mb-3 text-center">Session Total</p>
                    <div className="relative flex items-center justify-center">
                      <span className="text-2xl font-black text-white/30 mr-2 select-none">₹</span>
                      <input 
                        type="number" required min="0" placeholder="0" 
                        value={createForm.totalAmount} onChange={(e) => setCreateForm({ ...createForm, totalAmount: e.target.value })}
                        className="w-32 bg-transparent border-b-2 border-white/20 pb-1 text-center font-serif font-black text-4xl text-white outline-none focus:border-white transition-all placeholder:text-white/20" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-brown-100/60 bg-[#F9F6F0]/30 flex items-center justify-between gap-4">
              <button type="button" onClick={() => setCreateModal(false)} className="px-8 py-4 rounded-full text-sm font-bold text-brown-500 hover:text-brown-900 transition-colors">
                Cancel
              </button>
              <button type="submit" form="createForm" disabled={submitting} className="px-10 py-4 rounded-full text-sm font-bold text-white bg-brown-900 hover:bg-brown-800 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2 shadow-[0_8px_24px_-8px_rgba(62,39,35,0.5)]">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {submitting ? "Processing…" : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsView;
