import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Product Name"],
    },
    photo: {
      type: String,
      required: [true, "Please enter your Product Photo"],
    },
    price: {
      type: Number,
      required: [true, "Please enter the Product Price "],
    },
    stock: {
      type: Number,
      required: [true, "Please enter the availbe Stock of the Product"],
    },
    category: {
      type: String,
      required: [true, "Please enter the Product's category"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
