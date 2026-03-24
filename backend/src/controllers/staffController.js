import Appointment from "../models/appointment.model.js";
import Notice from "../models/natice.model.js";

export const getMyProfile = async (req, res) => {
  try {
    // req.user comes from verifyToken middleware.
    // We populate 'staffProfile' to get the linked Staff details (specialization, etc.)
    const user = await req.user.populate("staffProfile");

    if (!user.staffProfile) {
      return res.status(404).json({ message: "Staff profile not linked." });
    }

    res.status(200).json(user.staffProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaffSchedule = async (req, res) => {
  try {
    const { date } = req.query; // e.g. ?date=2025-02-14

    const user = await req.user.populate("staffProfile");

    if (!user.staffProfile) {
      return res.status(400).json({ message: "Not a staff member" });
    }

    const query = {
      staff: user.staffProfile._id,
      status: { $ne: "cancelled" },
    };

    // Filter by Date if provided
    if (date) {
      const queryDate = new Date(date);
      const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .populate("userId", "name phone")
      .populate("services.serviceId", "name duration")
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// update appointment status (e.g., mark as completed, noshow, etc.)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "completed", "noshow"

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};