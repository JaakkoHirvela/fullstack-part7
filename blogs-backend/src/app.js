const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const { errorHandler, userExtractor } = require("./utils/middleware");
require("express-async-errors");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  console.log("Testing route enabled");
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(errorHandler);

module.exports = app;
