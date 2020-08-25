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
    const customerCart = await Cart.findOne({ customerID: customerID });
    let cart = [];
    await Promise.all(
      customerCart.products.map(async (product) => {
        try {
          const cartItem = await Products.findOne({
            productID: product.productID,
          });

          return cart.push({ product: cartItem, qty: product.qty });
        } catch (error) {
          console.log(error);
        }
      })
    );
    //check if user has cart
    if (cart.length !== 0) {
      return res.send({
        success: true,
        result: {
          cart_items: cart,
        },
      });
    }

    return res.send({
      success: false,
      result: {
        message: "No Cart saved.",
      },
    });
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
      return res.send({
        success: true,
        result: {
          product: product,
        },
      });
    }
    return res.send({
      success: false,
      result: {
        message: "Product does not exist.",
      },
    });
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
      return res.status(200).send({
        success: true,
        result: {
          message: "Product has been removed.",
        },
      });
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
        return res.send({
          success: true,
          result: {
            exist: true,
            cart: existingCart,
          },
        });
      }

      //not exist - add product to the cart then save
      existingCart.products.push({ productID, qty });
      existingCart = await existingCart.save();

      return res.send({
        success: true,
        result: {
          exist: false,
          cart: existingCart,
        },
      });
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
        success: true,
        result: {
          exist: false,
          cart: newCart,
        },
      });
    }
  } catch (error) {
    return res.send("ERROR: " + error);
  }
};
