const express=require('express');
const app=express();


app.use(express.json())

const users=[
    {
        id:"1",
        userName:"john",
        password:"123456",
        isAdmin:true
    },
    {
        id:"2",
        userName:"sam",
        password:"54321",
        isAdmin:false
    }
]

app.post('/api/login',(req,res)=>{
    const {userName,password} = req.body;
   const userDetails= users.find(u=>{
        return u.userName === userName && password === u.password
    })
    if(userDetails){
        res.json(userDetails)
    }else{
        res.status(400).json("user anem or passowrd is incorrect")
    }
})

app.listen(5000,()=>{console.log("Backend server is running")})