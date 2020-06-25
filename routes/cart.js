const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
//controllers
const auth = require("../authenticate/auth");
const cartController = require("../controllers/CartController");

//schema
const Products = require("../models/Products");
const Cart = require("../models/CartItem");
const Users = require("../models/Users");

//get current user's cart
router.get("/:id", auth, cartController.getCartByUserId);

//get cart product details
router.get("/item/:id", auth, cartController.getCartProductDetails);

//ADD ITEM TO CART
router.post("/addToCart", auth, cartController.addToCart);

//DELETE ITEM PRODUCT
router.delete("/delete/:id", auth, cartController.deleteCartProduct);

module.exports = router;
