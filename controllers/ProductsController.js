const uniqid = require("uniqid");
const Products = require("../models/Products");

module.exports = {
  addProduct: async (req, res) => {
    try {
      const productName_exist = await Products.findOne({ name: req.body.name });
      if (productName_exist) {
        return res.send({
          status: "NOK",
          result: {
            message: "Product exist, please check your cart.",
          },
        });
      }
      const product = new Products({
        name: req.body.name,
        stocks: req.body.stocks,
        price: req.body.price,
        sell_type: req.body.sell_type,
        img: req.body.img,
        category: req.body.category,
        is_new: req.body.is_new,
        is_featured: req.body.is_featured,
      });
      product
        .save()
        .then(() => {
          res.send({
            status: "OK",
            result: {
              message: "Product has been added.",
            },
          });
        })
        .catch((err) => console.log(err));
      return;
    } catch (error) {
      console.log(error);
      return res.status(500).send("ERROR: " + error);
    }
  },
  // get new, featured products
  getProductsByPromoType: async (req, res) => {
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
          status: "OK",
          result: {
            products: products,
          },
        });
      return res.send({
        status: "NOK",
        result: {
          message: "No Products Found.",
        },
      });
    } catch (error) {
      return res.send("ERROR: " + error);
    }
  },
  getProductsByCategoryID: async (req, res) => {
    try {
      const categoryID = Number(req.params.id);
      if (categoryID !== 0) {
        const products = await Products.find()
          .where("category")
          .in(categoryID)
          .exec();
        if (products)
          return res.send({
            status: "OK",
            result: {
              products: products,
            },
          });

        return res.send({
          status: "NOK",
          result: {
            message: "No Products Found.",
          },
        });
      }
      const products = await Products.find();

      if (products) {
        return res.send({
          status: "OK",
          result: {
            products: products,
          },
        });
      }
      return res.send({
        status: "NOK",
        result: {
          message: "No Products Found",
        },
      });
    } catch (error) {
      return res.send("ERROR: " + error);
    }
  },
};
