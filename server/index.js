const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const cors = require("cors");
const passport = require("passport");
require("./config/passport")(passport); // 這段有點不懂為何要放在index.js之中，因為下面用passport.authenticate的關係嗎？

//連結MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors
app.use(cors());

//跟認證有關的，都導向到這個router
app.use("/api/user", authRoute);

//跟課程有關的，都導向到這個router
//course route應該被jwt保護
//如果request header沒有jwt，則request應該被視為unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

//不要使用port3000，3000是react的預設伺服器。
app.listen(8080, () => {
  console.log("後端伺服器正在聆聽Port 8080...");
});
