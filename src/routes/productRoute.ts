import express from "express";
import { andminOnly } from "../middlewares/auth.js";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getlatestProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/productController.js";
import { singleUpload } from "../middlewares/multer.js";
import { get } from "http";

const app = express.Router();

// Create New Product - /api/v1/product/new
app.post("/new", andminOnly, singleUpload, newProduct);

// To get last 10 products - /api/v1/product/latest
app.get("/latest", getlatestProducts);

// To get last all products with filter- /api/v1/product/latest
app.get("/all", getAllProducts);

// To get all unique categories of the the product:-
//  /api/v1/product/categories
app.get("/categories", getAllCategories);

// To get all product that is admin asscessble - /api/v1/product/admin-products
app.get("/admin-products", getAdminProducts);

// To get single product and update it and delete it - /api/v1/product/:id
app
  .route("/:id")
  .get(getSingleProduct)
  .put(andminOnly,singleUpload, updateProduct)
  .delete(andminOnly,deleteProduct);

export default app;
