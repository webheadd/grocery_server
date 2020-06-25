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
      return res.send("Product exist, please check your list");
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
      is_featured: req.body.is_featured
    });
    const savedProduct = await product.save();
    return res.send("Product Added: " + savedProduct);
  } catch (error) {
    return res.status(500).send("ERROR: " + error);
  }
});

//customer side
//get all products
router.get("/", auth, async (req, res) => {
  const categoryID = Number(req.query.category_id);
  try {
    if (categoryID !== 0) {
      const products = await Products.find()
        .where("category")
        .in(categoryID)
        .exec();
      if (products) return res.send(products);

      return res.send("No Products Found");
    }
    const products = await Products.find();

    if (products) {
      return res.json(products);
    }
    return res.send("No Products Found");
  } catch (error) {
    return res.send("ERROR: " + error);
  }
});

//get featured products
router.get("/featured", auth, async (req, res) => {
  try {
    const products = await Products.find({ is_featured: true });

    if (products) {
      return res.json(products);
    }
    return res.send("No Featured Products");
  } catch (error) {
    return res.send("ERROR: " + error);
  }
});
//get new products
router.get("/new", auth, async (req, res) => {
  try {
    const products = await Products.find({ is_new: true });

    if (products) {
      return res.json(products);
    }
    return res.send("No Featured Products");
  } catch (error) {
    return res.send("ERROR: " + error);
  }
});
module.exports = router;
