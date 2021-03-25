const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  if (!req.headers.authorization) return res.send("Not Authorized");
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    // console.log(token);

    if (!token) return res.status(401).send("You are not authorized");
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    // res.send(error);
  }
};

module.exports = auth;
