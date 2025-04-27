const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const accountRoute = require("./routes/accounts");
const productsRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const cors = require("cors");
require("dotenv/config");

const app = express();

const allowedOrigins = [
  "*",
  "http://localhost:5000",
  "http://localhost:8100",
  "http://localhost:8101",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },
};

app.use(cors());
// app.options("*", cors(corsOptions));
// app.use("/", cors(corsOptions));

//middlewares
app.use(bodyParser.json()); // this is to make sure all data are parsed into json format

// Account Related Routes
app.use("/account", accountRoute);

// Product Routes
app.use("/products", productsRoute);

// Cart Routes
app.use("/cart", cartRoute);

// db connection
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// 🚀 VERY IMPORTANT: Export the app (don't listen here)
module.exports = app;
