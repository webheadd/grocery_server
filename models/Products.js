const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    stocks: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sell_type: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    category: {
      type: Array,
      required: true,
    },
    //   total_orders: {
    //     type: Number,
    //     required: true
    //   }
    is_new: {
      type: Boolean,
      required: true,
    },
    is_featured: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
/*
id : numb
name : string
manufacturer?: string
promo/discount?: string
stocks: num
price: num
sell_type: string (piece, kilo)
img: string
product_category: string
total_orders: num (use for best seller product computation?)
isNew: boolean
isFeatured: boolean
dateAdded: date
*/

module.exports = mongoose.model("Products", productSchema);
