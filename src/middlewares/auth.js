const config = require('config');
const jwt = require('jsonwebtoken');
const Sequelize =require('sequelize')
const sequelize = require("../../startup/db");
const User= require('./../models/user')
// const User= require("../models/user");
// const sequelize = require('../../startup/db')
// const User = db.import('users', require('../models/user'));
console.log('User', User);
async function isLoggined(req , res , next){
  const token = req.header("x-auth-token");
  // console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",token)
  if(!token) res.status(401).send('access denied');
  try{
    const decoded = jwt.verify(token ,"sherkatmavadmohandesimokarrar");
    console.log("token",decoded);
    console.log('User', User)
    const user =  await User.findOne({where:{id :decoded.userId}});
    console.log("user is ",user);
    req.user = user;
    next();
    
  }catch(ex){
    console.log(ex)
  res.status(400).send('invalid token')
  }
 

}
async function isAdmin(req ,res , next){
   if(!req.user.isadmin){
       res.status(403).send("access denied");
       
   }  
   next();
}
module.exports={
    isLoggined , isAdmin
}
