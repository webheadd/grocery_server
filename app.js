const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const accountRoute = require("./routes/accounts");
const productsRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const cors = require("cors");
require("dotenv/config");

const app = express();
const port = 5000;
const allowedOrigins = [
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
//db connection
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to db!");
  }
);
//TODO: reroute if http://sitename/
// app.get("/", (req, res) => {
//   res.redirect("http://localhost:8100/welcome-page");
// });

//middlewares
app.use(bodyParser.json()); // this is to make sure all data are parsed into json format

app.use("/account", accountRoute);
app.use("/products", productsRoute);
app.use("/cart", cartRoute);

//listen to port
app.listen(port, () => {
  console.log("app running in port " + port);
});
