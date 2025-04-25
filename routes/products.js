const express = require("express");
const router = express.Router();
const auth = require("../authenticate/auth");
const {
  getProductsByCategoryID,
  getProductsByPromoType,
  addProduct,
  getHomeProducts,
} = require("../controllers/ProductsController");

//get all products by promo type
router.post("/", auth, getProductsByPromoType);

//get home page products (5 for each New & Featured type)
router.get("/home", getHomeProducts);

//get all products by category ID
router.get("/category/:id", auth, getProductsByCategoryID);

// ADMIN
//add single product
router.post("/add", auth, addProduct);

module.exports = router;
