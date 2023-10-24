const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"], // enumeration的縮寫，有限集合，只有這些特定值為有效，其他為無效。
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Schema instance methods
userSchema.methods.isStudent = function () {
  return this.role == "student";
};
userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

userSchema.methods.comparePassword = async function (password, callBack) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password); // 返回一個boolean值

    return callBack(null, result);
  } catch (e) {
    console.log(result);
    return callBack(e, result);
  }
};

// mongoose middleware
// 若使用者為新用戶，或是正在更改密碼，這兩個狀況我們則將密碼進行雜湊處理Hash
//這邊進行雜湊處理
// this關鍵字不適用arrow function，所以用一般的function expression
userSchema.pre("save", async function (next) {
  //pre()會在執行save前，先執行後面這個函式，所以我們就可以執行雜湊處理
  //this代表mongoDB內的document，也就是個別用戶資料
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
