import express from "express";
import { andminOnly } from "../middlewares/auth.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

import {
  getBarCharts,
  getDashboardStats,
  getLineCharts,
  getPiechart,
} from "../controllers/statsController.js";

const app = express.Router();

// route -/api/v1/dashboard/stats
app.get("/stats", andminOnly, getDashboardStats);

// route -/api/v1/dashboard/pie
app.get("/pie", andminOnly, getPiechart);

// route -/api/v1/dashboard/bar
app.get("/bar", andminOnly, getBarCharts);

// route -/api/v1/dashboard/line
app.get("/line", andminOnly, getLineCharts);

export default app;
