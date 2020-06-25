const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//schema
const Products = require("../models/Products");
const Cart = require("../models/CartItem");
const Users = require("../models/Users");

//get current user's cart
exports.getCartByUserId = async (req, res) => {
  try {
    const customerID = req.params.id;
    const cart = await Cart.findOne({ customerID: customerID });

    //check if user has cart
    if (cart) {
      return res.send(cart);
    }

    return res.send("You don't have cart saved");
  } catch (error) {
    return res.status(500).send("Something went wrong");
  }
};

//get cart product details
exports.getCartProductDetails = async (req, res) => {
  const productID = req.params.id;
  try {
    const product = await Products.findOne({ productID: productID });

    if (product) {
      return res.send(product);
    }
    return res.send("No Product");
  } catch (error) {
    return res.send("ERROR: " + error);
  }
};

exports.deleteCartProduct = (req, res) => {
  Cart.updateOne(
    { customerID: req.user.subject },
    {
      $pull: {
        products: { productID: req.params.id },
      },
    }
  )
    .then(() => {
      console.log("Deleted");
      return res.status(200).send({ message: "Product Removed" });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.addToCart = async (req, res) => {
  const { productID, qty } = req.body.products[0]; //pull out productid and quantity from user input

  const customerID = req.user.subject; // current user id
  try {
    //check if customer has existing cart
    let existingCart = await Cart.findOne({ customerID: customerID });

    if (existingCart) {
      //if cart is available get index of current productID
      let productIndex = existingCart.products.findIndex(
        (prod) => prod.productID === productID
      );

      //check if product exist in cart
      if (productIndex > -1) {
        //if exist get product
        let productItem = existingCart.products[productIndex];

        //then update product quantity
        productItem.qty = productItem.qty + qty;

        //then update the products array
        existingCart.products[productIndex] = productItem;

        // then save the updated cart
        existingCart = await existingCart.save();
        return res.send({ exist: true, cart: existingCart });
      }

      //not exist - add product to the cart then save
      existingCart.products.push({ productID, qty });
      existingCart = await existingCart.save();

      return res.send({ exist: false, cart: existingCart });
      //update cart
    } else {
      //if customer has no existing cart, create one
      const newCart = Cart.create({
        customerID: req.body.customerID,
        products: [
          {
            productID,
            qty,
          },
        ],
      });
      return res.send({
        exist: false,
        cart: newCart,
      });
    }
  } catch (error) {
    return res.send("ERROR: " + error);
  }
};
