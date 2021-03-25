const express = require("express");
const router = express.Router();
const auth = require("../authenticate/auth");
const {
  getProductsByCategoryID,
  getProductsByPromoType,
  addProduct,
} = require("../controllers/ProductsController");

//get all products by promo type
router.post("/", auth, getProductsByPromoType);

//get all products by category ID
router.get("/category/:id", auth, getProductsByCategoryID);

// ADMIN
//add single product
router.post("/add", auth, addProduct);

module.exports = router;
