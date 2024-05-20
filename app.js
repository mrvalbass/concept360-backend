require("dotenv").config();
require("./models/connection");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileUpload = require("express-fileupload");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const exerciceRouter = require("./routes/exercices");

const app = express();

const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/exercices", exerciceRouter);

module.exports = app;
