const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const database = require("./utils/database");
const logger = require("./utils/logger");
const middleware = require("./middlewares/middleware");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const itemRouter = require("./routes/itemRoutes");

mongoose.set("strictQuery", false);

if (database.MONGODB_URI) {
  logger.info("Connecting to Database ...");
}

mongoose
  .connect(database.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/items", itemRouter);

module.exports = app;
