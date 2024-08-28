import express from "express";
import { andminOnly } from "../middlewares/auth.js";
import {
  allCoupons,
  applyDiscount,
  createPaymentIntent,
  deleteCoupon,
  newCoupon,
} from "../controllers/paymentController.js";

const app = express.Router();

// route - /api/v1/payment/create
app.post("/create", createPaymentIntent);

//route - /api/v1/payment/discount
app.get("/discount", applyDiscount);

// route - /api/v1/payment/coupon/new
app.post("/coupon/new", andminOnly, newCoupon);

// route - /api/v1/payment/coupon/all
app.get("/coupon/all", andminOnly, allCoupons);

// route - /api/v1/payment/coupon/:id
app.route("/coupon/:id")
//   .get(adminOnly, getCoupon)
//   .put(adminOnly, updateCoupon)
.delete(andminOnly, deleteCoupon);

export default app;
