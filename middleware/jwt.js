const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSign = async (req, res) => {
  try {
    const { email } = req.body;
    const ast = await jwt.sign({ email }, process.env.JWT_SECRET);
    return res.send({ status: "200", token: ast });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
};

const jwtVerify = async (req, res, next) => {
  try {
    const ast = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(ast, process.env.JWT_SECRET);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
};

module.exports = {
  jwtSign,
  jwtVerify,
};
