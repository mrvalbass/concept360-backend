require("dotenv").config();
require("./models/connection");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileUpload = require("express-fileupload");

const usersRouter = require("./routes/users");
const notificationRouter = require("./routes/notifications");
const exerciseRouter = require("./routes/exercises");
const routinesRouter = require("./routes/routines");
const programsRouter = require("./routes/programs");

const app = express();

const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

app.use("/users", usersRouter);
app.use("/notifications", notificationRouter);
app.use("/exercises", exerciseRouter);
app.use("/routines", routinesRouter);
app.use("/programs", programsRouter);

module.exports = app;
