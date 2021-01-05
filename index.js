const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { User } = require("./models/User")
const { auth } = require('./middleware/auth')
//application/x-www-form-urlencoded 형태를 분석, 가져오는데 사용
app.use(bodyParser.urlencoded({extended: true}))

//application/json 형태를 분석, 가져오는데 사용
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!22222222')
})


app.post('/api/users/register', (req,res)=>{
    //회원가입 정보를 client에서 가져오고 DB에 저장
    const user = new User(req.body)
    user.save((err, userinfo) =>{
        if(err) return res.json({success:false, err})   //실패시
        return res.status(200).json({success: true})    //성공시
    }) //몽고db 메서드
})

app.post('/api/users/login', (req,res)=>{
    //요청된 이메일을 DB에 있는지 확인
    User.findOne({email: req.body.email}, (err,user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        //요청된 이메일이 DB에 있으면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err,isMatch) =>{
            if(!isMatch) return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})
            
            //비밀번호가 맞다면 토큰 생성
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                //토큰을 저장 (쿠키, 로컬 스토리지)
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess:true, userID: user._id})
            })
        })
    })
})

app.get('/api/users/auth',auth,(req,res)=>{
    //여기까지 미들웨어를 통과했다는 의미는 Authentication 이 True를 의미
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false:true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image:req.user.image
    })
})

app.get('/api/users/logout',auth, (req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},
        {token:''},
        (err,user)=>{
            if(err) return res.json({success: false,err});
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})