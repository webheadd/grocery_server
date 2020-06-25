const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productID: {
    type: String,
    userCreateIndex: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  stocks: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sell_type: {
    type: String,
    required: true
  },
  img: {
    type: String
  },
  category: {
    type: Array,
    required: true
  },
  //   total_orders: {
  //     type: Number,
  //     required: true
  //   }
  is_new: {
    type: Boolean,
    required: true
  },
  is_featured: {
    type: Boolean,
    required: true
  },
  date_added: {
    type: Date,
    default: Date.now
  }
});
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
