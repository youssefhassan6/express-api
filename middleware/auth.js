const jwt = require("jsonwebtoken");

function auth(req, res, next) {

  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      message: "Access denied"
    });
  }

  const token = header.split(" ")[1];

  try {

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;

    next();

  } catch {

    res.status(400).json({
      message: "Invalid token"
    });

  }

}

module.exports = auth;