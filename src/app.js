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
const barterRouter = require("./routes/barter");

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

const allowedOrigins = ["http://localhost:5173"]; // Add your frontend origin

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/items", itemRouter);
app.use("/api/trade", barterRouter);

module.exports = app;
