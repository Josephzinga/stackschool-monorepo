import { config } from "dotenv";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import indexRouter from "./routes/route";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth.routes";
import cors from "cors";

config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//app.locals.pluralize = require("pluralize");

// view engine setup
//app.set("views", path.join(__dirname, "views"));
//app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use("/", indexRouter);

app.use("/", authRouter);

app.get("/", (req, res) => {
  res.json("message serveur connecter");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(4000, () => {
  console.log("server is runign on port http://localhost:4000");
});
