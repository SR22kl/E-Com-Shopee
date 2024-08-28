import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/productModel.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { faker } from "@faker-js/faker";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

// Revalidate on New, Update, Delete Product & on New Order
export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-products"))
    products = JSON.parse(myCache.get("latest-products") as string);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    myCache.set("latest-products", JSON.stringify(products));
  }

  return res.status(201).json({
    success: true,
    products,
  });
});

// Revalidate on New, Update, Delete Product & on New Order
export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(201).json({
    success: true,
    message: "Product category fetch successfully",
    categories,
  });
});

// Revalidate on New, Update, Delete Product & on New Order
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("all-products"))
    products = JSON.parse(myCache.get("all-products") as string);
  else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }

  return res.status(201).json({
    success: true,
    message: "Products fetch successfully(admin only)",
    products,
  });
});

// Revalidate on New, Update, Delete Product & on New Order
export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;

  const id = req.params.id;
  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    message: `Product with id: ${product.id} fetched successfully`,
    product,
  });
});

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please Add a Photo", 400));

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log(`Deleted temp file: ${photo.path}`);
      });
      return next(new ErrorHandler("Please Enter all Fields", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    invalidateCache({ product: true,  admin: true });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category, description } = req.body;
  const photo = req.file;
  // const photos = req.files as Express.Multer.File[] | undefined;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log(`Deleted old file: ${product.photo}`);
    });
    product.photo = photo.path;
  }

  // if (photos && photos.length > 0) {
  //   const photosURL = await uploadToCloudinary(photos);

  //   const ids = product.photos.map((photo) => photo.public_id);

  //   await deleteFromCloudinary(ids);

  //   product.photos = photosURL;
  // }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  // if (description) product.description = description;

  await product.save();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  rm(product.photo!, () => {
    console.log(`Product Photo File: ${product.photo} Deleted`);
  });

  await product.deleteOne();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: `Product: ${product.name} Deleted Successfully`,
    product,
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const key = `products-${search}-${sort}-${category}-${price}-${page}`;

    // 1,2,3,4,5,6,7,8
    //9,10,11,12,13, 14,15,16
    //17,18,19,20,21,22,23,24
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const productPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filterOnlyProduct] = await Promise.all([
      productPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filterOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      products,
      totalPage,
    });
  }
);

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\d894804-0679-453d-9355-112b1d007ac0.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };

// generateRandomProducts(40);

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };

// deleteRandomsProducts(40);
