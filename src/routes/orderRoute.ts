import express from "express";
import { andminOnly } from "../middlewares/auth.js";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/orderController.js";

const app = express.Router();

// route -/api/v1/order/new
app.post("/new", newOrder);

// route -/api/v1/order/my
app.get("/my", myOrders);

// route -/api/v1/order/all
app.get("/all", andminOnly, allOrders);

// To get single order, update it and delete it - /api/v1/product/:id
app
  .route("/:id")
  .get(getSingleOrder)
  .put(andminOnly, processOrder)
  .delete(andminOnly, deleteOrder);

export default app;
