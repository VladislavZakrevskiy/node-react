const jwt = require('jsonwebtoken')
const {secret} = require('../config')
module.exports = function(req,res, next){
    if(req.method == "OPTIONS"){
        next()
    }

    try {
        console.log(req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1]
        
        if(!token){
            return res.status(401).json({message:"Пользователь не авторизован 1"})
        }
        
        next()
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            res.json({message: "token expired"})
            return
        }
        else if(error instanceof jwt.JsonWebTokenError){
            res.json({message: "JsonWebTokenError"})
            return
        }
        else{ 
            console.log(req.headers.authorization)
            return res.status(402).json({message:"Пользователь не авторизован 2"})
            
        }
    }
}