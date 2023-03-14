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
        res.status(400).json("user name  or passowrd is incorrect")
    }
})

const verify=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(authHeader){
        const token=authHeader.split(" ")[1];
        jwt.verify(token,"mySecretKey",(err,user)=>{
            if(err){
                return res.status(403).json("Token is not valid")
            }
            req.user=user;
            next();
        })  
    }else{
        res.status(401).json("You are not authenticated")
    }
}

app.delete('/api/users/:userId',verify,(req,res)=>{
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("User has been deleted")
    }else{
        res.status(403).json("You are anot allowed to delete the user")
    }
})

app.listen(5000,()=>{console.log("Backend server is running")})