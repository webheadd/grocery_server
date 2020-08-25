const express = require("express");
const router = express.Router();
const uniqid = require("uniqid");
const Products = require("../models/Products");

const auth = require("../authenticate/auth");

//add products
router.post("/add", auth, async (req, res) => {
  try {
    const productName_exist = await Products.findOne({ name: req.body.name });
    if (productName_exist) {
      return res.send({
        success: false,
        result: {
          message: "Product exist, please check your cart.",
        },
      });
    }
    const product = new Products({
      productID: uniqid(),
      name: req.body.name,
      stocks: req.body.stocks,
      price: req.body.price,
      sell_type: req.body.sell_type,
      img: req.body.img,
      category: req.body.category,
      is_new: req.body.is_new,
      is_featured: req.body.is_featured,
    });
    const savedProduct = await product.save();
    return res.send({
      success: true,
      result: {
        message: "Product has been added.",
        product: savedProduct,
      },
    });
  } catch (error) {
    return res.status(500).send("ERROR: " + error);
  }
});

//customer side
//get all products by category ID
router.post("/", auth, async (req, res) => {
  try {
    const type = req.body.type;
    let products = await Products.find();
    if (type) {
      switch (type) {
        case "new":
          products = await Products.find({ is_new: true });
          break;
        case "featured":
          products = await Products.find({ is_featured: true });
          break;
      }
    }
    if (products)
      return res.send({
        success: true,
        result: {
          products: products,
        },
      });
    return res.send({
      success: false,
      result: {
        message: "No Products Found",
      },
    });
  } catch (error) {
    return res.send("ERROR: " + error);
  }
});
//get all products by category ID
router.get("/category/:id", auth, async (req, res) => {
  try {
    const categoryID = Number(req.params.id);
    if (categoryID !== 0) {
      const products = await Products.find()
        .where("category")
        .in(categoryID)
        .exec();
      if (products)
        return res.send({
          success: true,
          result: {
            products: products,
          },
        });

      return res.send({
        success: false,
        result: {
          message: "No Products Found",
        },
      });
    }
    const products = await Products.find();

    if (products) {
      return res.send({
        success: true,
        result: {
          products: products,
        },
      });
    }
    return res.send({
      success: false,
      result: {
        message: "No Products Found",
      },
    });
  } catch (error) {
    return res.send("ERROR: " + error);
  }
});

module.exports = router;
