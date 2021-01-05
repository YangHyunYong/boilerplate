const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const config = require('./config/key')
const { User } = require("./models/User")
//application/x-www-form-urlencoded 형태를 분석, 가져오는데 사용
app.use(bodyParser.urlencoded({extended: true}))

//application/json 형태를 분석, 가져오는데 사용
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!22222222')
})


app.post('/register', (req,res)=>{
    //회원가입 정보를 client에서 가져오고 DB에 저장
    const user = new User(req.body)
    user.save((err, userinfo) =>{
        if(err) return res.json({success:false, err})   //실패시
        return res.status(200).json({success: true})    //성공시
    }) //몽고db 메서드
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})