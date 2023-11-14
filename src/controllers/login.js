const loginRouter = require("express").Router();
const loginMiddleware = require("../middlewares/auth");

loginRouter.post("/", loginMiddleware, (req, res) => {
  res.status(200).send({ token: res.locals.token, username: res.locals.username, name: res.locals.name });
});

module.exports = loginRouter;
