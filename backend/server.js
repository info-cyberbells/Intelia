import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import superAdminRoutes from "./src/routes/super-admin.routes.js";
import ownerRoutes from "./src/routes/owner.routes.js";
import driverRoutes from "./src/routes/driver.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes with role-based prefixes
app.use("/api/auth", authRoutes);
app.use("/api/superAdmin", superAdminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/driver", driverRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));