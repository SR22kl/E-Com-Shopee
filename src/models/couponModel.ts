import mongoose from "mongoose";

const schema = new mongoose.Schema({
  CouponCode: {
    type: String,
    required: [true, "Please enter the Coupon Code"],
    unique: true,
  },
  amount: {
    type: Number,
    required: [true, "Please enter the Discount Amount"],
  },
});

export const Coupon = mongoose.model("coupon", schema);
