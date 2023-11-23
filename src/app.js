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

// const allowedOrigins = ["https://t-brown.vercel.app/"]; // Add your frontend origin

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

//app.use(cors());

// const corsOptions = {
//   origin: 'https://t-wofy67dv8-arfandwisukmajaya.vercel.app',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));
app.use(cors({
     origin: "https://t-brown.vercel.app/",
     methods: ["GET", "POST", "DELETE", "HEAD", "PUT", "PATCH"],
     allowedHeaders: ["Content-Type", "Authorization"]
   }));

app.use(express.json());
app.use(middleware.requestLogger);

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});
app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/items", itemRouter);
app.use("/api/trade", barterRouter);

module.exports = app;
