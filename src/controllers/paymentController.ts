import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/couponModel.js";
import ErrorHandler from "../utils/utility-class.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) return next(new ErrorHandler("Please enter amount", 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "INR",
  });

  return res.status(201).json({
    success: true,
    message: `Payment of Amount: ${amount} Done Successfully`,
    clientSecret: paymentIntent.client_secret,
  });
});

export const newCoupon = TryCatch(async (req, res, next) => {
  const { CouponCode, amount } = req.body;

  if (!CouponCode || !amount)
    return next(new ErrorHandler("Please enter both coupon and amount", 400));

  await Coupon.create({ CouponCode: CouponCode, amount });

  return res.status(201).json({
    success: true,
    message: `Coupon ${CouponCode} Created Successfully`,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { code } = req.query;

  const discount = await Coupon.findOne({ CouponCode: code });

  if (!discount) return next(new ErrorHandler("Invalid CouponCode", 404));

  return res.status(200).json({
    success: true,
    discount: discount.amount,
    message: `Discount applied with CouponCode : ${code}`,
  });
});

export const allCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  if (!coupons) return next(new ErrorHandler("Coupons not Found", 404));

  return res.status(200).json({
    success: true,
    message: `All Coupons Fetch sucessfully`,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const coupons = await Coupon.findById(id);

  if (!coupons) return next(new ErrorHandler("Invalid id", 404));

  await coupons.deleteOne();

  return res.status(200).json({
    success: true,
    message: `Coupon With ID: ${id} Deleted Successfully`,
    coupons,
  });
});
