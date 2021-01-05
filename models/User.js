const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    maxlength: 100,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//pre: mongoose에서 가져온 메서드
userSchema.pre("save", function (next) {
  var user = this;
  //비밀번호 변경 시에만 동작
  if (user.isModified("password")) {
    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next(); //next()실행 시 index.js의 save()로 넘어감
      });
    });
  } else{
      next()
  }
});


userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    //jsonwebtoken을 이용해서 token 생성
    // user._id + 'secretToken = token
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;
    //토큰을 decode 한다
    jwt.verify(token,'secretToken',function(err,decoded){
        //유저 아이디를 이용해 유저를 찾은 후
        //클라이언트에서 가져온 token과 DB에 저장된 토큰이 일치하는지 확인

        //mongoDB 메서드
        user.findOne({"_id":decoded, "token": token}, function(err,user){
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

const User = mongoose.model("User", userSchema);

module.exports = { User };
