const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema({
  customerID: {
    type: String,
    require: true
  },
  products: [
    {
      productID: {
        type: String,
        require: true
      },
      qty: {
        type: Number,
        required: true
      }
    }
  ],
  date_added: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Cart", cartItemSchema);
