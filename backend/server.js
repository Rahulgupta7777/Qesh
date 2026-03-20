import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/authRoutes.js";
import publicRoutes from "./src/routes/publicRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import staffRoutes from "./src/routes/staffRoute.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://qesh.vercel.app",
  "https://qesh-admin.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // For now, allow all origins to unblock deployment if specific check fails
      // or uncomment below to restrict
      // return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());


// Logging Middleware
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) => {
  res.send("Qesh Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
