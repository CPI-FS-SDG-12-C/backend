const loginRouter = require("express").Router();
const loginMiddleware = require("../middlewares/auth");

loginRouter.post("/", loginMiddleware, (req, res) => {
  res.status(200).send({ token: res.locals.token });
});

module.exports = loginRouter;
