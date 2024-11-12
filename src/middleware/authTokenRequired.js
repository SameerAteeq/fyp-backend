const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");
const User = require("../model/User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(authorization);
  if (!authorization) {
    return res
      .status(401)
      .send({ error: "user must be logged in ,key not given" });
  } else {
    const token = authorization.replace("Bearer ", "");
    // console.log(to

    jwt.verify(token, process.env.jwt_secret, async (error, payload) => {
      if (error) {
        return res.status(401).send({
          error: "user must be logged in , invalid token ",
        });
      }

      const { userId, role } = payload;
      let model = User;
      if (role == "admin") {
        model = Admin;
      }

      model.findById(userId).then((user) => {
        req.user = user;
        next();
      });
    });
  }
};
