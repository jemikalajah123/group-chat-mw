const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  //extract the authorization header
  const authHeader = req.headers["authorization"];

  if (typeof authHeader !== "undefined") {
    //split token and bearer into bearer array
    const bearer = authHeader.split(" ");

    //set token
    const token = bearer[1];

    //verify the auth user
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res.status(401).json({
          responseCode: "02",
          status: "error",
          message: "Expired Session, Please Login Again"
        });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).json({
      responseCode: "02",
      status: "error",
      message: "Unauthenticated User"
    });
  }
};

module.exports = auth;
