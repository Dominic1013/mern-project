const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結auth route...");
});

//使用者註冊用route
router.post("/register", async (req, res) => {
  //確認數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過了...");

  //創建新用戶
  let { username, email, password, role } = req.body;
  let newUser = new User({ email, username, password, role });
  try {
    let saveUser = await newUser.save();
    return res.send({
      msg: "使用者成功儲存",
      saveUser,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法儲存使用者");
  }
});

//使用者登入用route
router.post("/login", async (req, res) => {
  //確認數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) {
    // console.log(error);
    return res.status(400).send(error.details[0].message);
  }

  //確認是否找到此使用者
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser)
    return res.status(401).send("未找到此使用者，請確認您的信箱是否正確");

  //把req.body的密碼拿去和foundUser資料庫裡的密碼（this關鍵字）做比較，確認密碼是否正確
  // 參數是req.body的password, callback
  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (isMatch) {
      //如果有密碼正確true，就製作JWT令牌
      //先做一個tokenObject
      let tokenObject = {
        _id: foundUser._id,
        email: foundUser.email,
      };
      //用object製作一個簽名過的JWT令牌，做jwt.sign(jwtObject, SECRET_KEY)
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);

      return res.send({
        msg: "已成功登入並製作JWT令牌",
        user: foundUser,
        token: "JWT " + token, // "JWT "後面一定要加空格！不然會有bug 這裡是寄給使用者
      });
    }
  });
});

module.exports = router;
