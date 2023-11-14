const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    console.log(decodedToken);
    request.user = decodedToken;
    next();
  } catch (error) {
    return response.status(401).json({ error: "Invalid token" });
  }
};

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

module.exports = verifyToken;
