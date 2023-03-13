const express=require('express');
const app=express();
const jwt=require('jsonwebtoken')


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
        //Generate an access token
        const accessToken=jwt.sign({id:userDetails.id,isAdmin:userDetails.isAdmin},"mySecretKey");

        res.json({
            userName:userDetails.userName,
            isAdmin:userDetails.isAdmin,
            accessToken
        })
    }else{
        res.status(400).json("user anem or passowrd is incorrect")
    }
})

app.listen(5000,()=>{console.log("Backend server is running")})