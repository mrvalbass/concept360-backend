require("dotenv").config();
require("./models/connection");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileUpload = require("express-fileupload");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
<<<<<<< routeNotif
const notificationRouter = require("./routes/notification");
=======
const exerciceRouter = require("./routes/exercices");
const routinesRouter = require("./routes/routines");
>>>>>>> main

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
<<<<<<< routeNotif
app.use("/notification", notificationRouter);
=======
app.use("/exercices", exerciceRouter);
app.use("/routines", routinesRouter);
>>>>>>> main

module.exports = app;
