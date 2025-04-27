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
// mongoose
//   .connect(process.env.DB_CONNECTION, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to DB"))
//   .catch((err) => console.log(err));
// Ensure MongoDB is connected only once
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    // If already connected, skip re-connection
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout for DB connection (5 seconds)
    });
    console.log("MongoDB connection successful.");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
};

connectDB();

  // Add this route to app.js
app.get("/test-db-connection", (req, res) => {
  // mongoose.connection.readyState === 1
  //   ? res.status(200).send("MongoDB is connected!")
  //   : res.status(500).send("MongoDB is not connected.");
  const start = Date.now();
  Product.find({})
    .then((results) => {
      const duration = Date.now() - start;
      console.log(`Query executed in ${duration}ms`);
      console.log(results);
      res.status(200).send(results)
    })
    .catch((err) => {
      console.error("Query error:", err);
    });

});


// 🚀 VERY IMPORTANT: Export the app (don't listen here)
module.exports = app;
