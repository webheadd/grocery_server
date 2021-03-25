const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
//controllers
const auth = require("../authenticate/auth");
const {
  getCartByUserId,
  getCartProductDetails,
  addToCart,
  deleteCartProduct,
} = require("../controllers/CartController");

//get current user's cart
router.get("/:id", auth, getCartByUserId);

//get cart product details
router.get("/item/:id", auth, getCartProductDetails);

//ADD ITEM TO CART
router.post("/addToCart", auth, addToCart);

//DELETE ITEM PRODUCT
router.delete("/delete/:id", auth, deleteCartProduct);

module.exports = router;
