const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uniqid = require("uniqid");

//schema
const Users = require("../models/Users");

const salt = 15;

module.exports = {
  // getCurrentUser: async (req, res) => {
  //   try {
  //     if (!req.headers.authorization) {
  //       return res.status(401).send("You are not authorized");
  //     }
  //     const token = req.headers.authorization.split(" ")[1];
  //     const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

  //     const user = await Users.findOne({
  //       customerID: decodedToken.subject,
  //     }).select("-password");
  //     return res.send({
  //       success: true,
  //       result: {
  //         user: user,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(500).send("qweqwe", err);
  //     // console.log(err);
  //   }
  // },
  signUp: async (req, res) => {
    try {
      const user = await Users.findOne({ mobile: req.body.mobile }); //check if mobile number is taken

      if (!user) {
        const customer = new Users({
          mobile: req.body.mobile,
          fname: req.body.fname,
          lname: req.body.lname,
          address: req.body.address,
        });
        customer.password = await bcrypt.hash(req.body.password, salt);
        customer
          .save()
          .then((userData) => {
            console.log("userData Created: ", userData)
            res.status(200).send({
              status: true,
              result: {
                message: "Registration Successful!",
                user: userData
              },
            });
          })
          .catch((err) => console.log(err));
        return;
      }

      return res.send({
        status: false,
        result: {
          message: "Mobile number already in use.",
        },
      });
    } catch (error) {
      console.log(error);
      // return res.status(500).send("ERROR: " + error);
    }
  },
  signIn: async (req, res) => {
    try {
      const user = await Users.findOne({
        mobile: req.body.mobile,
      });

      //check if user is not registered
      if (user === null || !user)
        return res.send({
          status: false,
          result: {
            message: "Username or password is incorrect.",
          },
        });
      const payload = { subject: user._id };

      const token = jwt.sign(payload, process.env.SECRET_KEY);

      //compare password
      const passwordIsMatched = await bcrypt.compare(
        req.body.password,
        user.password
      );
      //if correct send the user object.
      if (passwordIsMatched) {
        const userData = JSON.parse(JSON.stringify(user));
        delete userData.password;
        console.log(userData);
        return res.send({
          status: true,
          token: token,
          currentUser: userData,
        });
      } else {
        return res.send({
          status: false,
          result: {
            message: "Username or password is incorrect.",
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong");
    }
  },
};
