const express=require('express');
const app=express();
const jwt=require('jsonwebtoken')
const cors=require('cors')


app.use(cors())
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


const generateAccessToken=(userDetails)=>{
  return jwt.sign({id:userDetails.id,isAdmin:userDetails.isAdmin},"mySecretKey",{
        expiresIn:"15m"
    });
}

const generateRefreshToken=(userDetails)=>{
   return jwt.sign({id:userDetails.id,isAdmin:userDetails.isAdmin},"myRefreshKey",{
        expiresIn:"15m"
    });

}

app.post('/api/login',(req,res)=>{
    const {userName,password} = req.body;
   const userDetails= users.find(u=>{
        return u.userName === userName && password === u.password
    })
    if(userDetails){
      //Generate an access token
        generateAccessToken(userDetails)
        generateRefreshToken(userDetails)
        res.json({
            userName:userDetails.userName,
            isAdmin:userDetails.isAdmin,
            accessToken
        })
    }else{
        res.status(400).json("user name  or passowrd is incorrect")
    }
})

let refreshTokens = []

app.post('/api/refresh',(req,res)=>{
    //take token from user
    const refreshtoken=req.body.token
    //send error if there is no token or token is not valid
    if(!refreshtoken){
        return res.status(401).json("You are not autheticated");
    }
    //if everything is okay create a accesstoken,refresh token and send to user
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

//SO AUTHORIZATIOIN HEADER CONTAINS
// authorization: bearer token



const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.authorization
    if(authHeader==undefined){
        return res.status(401).json({error:"User not authenticated"})
    }
    let token=authHeader.split(" ").pop();
    jwt.verify(token,"secretKey123",(err,decoded)=>{
        if(err){
           return res.status(500).json({error:"Authentication faild"})
        }
        req.decoded=decoded
        next();
        
    })
    

}
app.post('/api/login',(req,res)=>{
    let {userName,password}=req.body;
    const userDetails=users.find((user)=>{
        return userName === user.userName && password === user.password;
    })
    if(!userDetails){
        return res.status(401).json("No User Found")
    }
    let token=jwt.sign(userDetails,"secretKey123",{
        expiresIn:"1d"
    })
    res.status(200).json({auth:true,token})
})


app.get('/api/books',verifyToken,(req,res)=>{
    const value=req.decoded;
    res.status(200).json({sucess:"YES U R AUTHENTICATED",decoded:value})
})

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})



app.listen(5000,()=>{console.log("Backend server is running")})