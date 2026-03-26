const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    
    let token = req.headers.authorization;
   // console.log(token);
    if (!token) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    //console.log(decoded);
    req.user = decoded;
    
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
