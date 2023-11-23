const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const loginMiddleware = async (request, response, next) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "Invalid email or password",
    });
  }

  const userForToken = {
    email: user.email,
    id: user.id,
    role: user.role,
    fullName: user.fullName,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 });

  response.locals.token = token;

  next();
};

module.exports = loginMiddleware;
