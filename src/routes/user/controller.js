const controller = require("../controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { orderBy, first, result, isObject, isNull } = require("lodash");
// const { sequelize } = require('../../models/credit')
const { Op } = require("@sequelize/core");
const { Sequelize, literal } = require("sequelize");
const { search } = require(".");
const { QueryTypes } = require("sequelize");
const jwt = require('jsonwebtoken')
const config = require('config')




module.exports = new (class extends controller {


  async register(req, res) {
    try {
      console.log("user data ................. , " , req.user)
      const {firstName ,lastName ,userName , password  } = req.body;
      const salt = await bcrypt.genSalt(10)
      const encriptedPassword= await bcrypt.hash(password, salt)
     
      const [user, created] = await this.User.findOrCreate({
        where: { username: userName },
        defaults: {
          firstname: firstName,
          lastname: lastName,
          username: userName,
          password: encriptedPassword,
          accessLevel: req.body?.accessLevel || 4,
          partition: req.body?.partition || req.user?.partition
        },
      });
      created
        ? this.response({
            res,
            message: "this user created",
            data: { user, created },
          })
        : this.response({
            res,
            message: "this username already exists.!",
            data: { user, created },
          });
      console.log(user, created);
      
    } catch (error) {
      console.log(error.message);
    }

  }

 
  
  async changePassword(req , res){
     console.log("req body",req.body); 
     console.log("req user id",req.user); 

    await this.User.findOne({where:{id :req.user.id}})   
    .then((user)=>{
      user.update({password:req.body.newpassword});
      user.save();
      this.response({res, message:"password changed!" , data:user});
    }).catch((err)=>console.log(err.message));
    
  }
 async login(req, res) {
    const{username , password} = req.body
    
    const user = await this.User.findOne({ where: { username: username } });
    console.log('user in the login' , user);
    if (!user) {
      return this.response({
        res,
        code: 400,
        message: 'invalid email or password',
      })
    }
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return this.response({
        res,
        code: 400,
        message: 'invalid email or password',
      })
    }
    const token = jwt.sign({ userId: user.id , partition:user.partition,accessLevel:user.accessLevel },"sherkatmavadmohandesimokarrar")
    this.response({ res, message: 'successful loged in ', data:{"success":true,accessLevel:user.accessLevel ,partition:user.partition, "token":token}})
  } 
  
  async changePassword(req , res){
    const {newPassword} = req.body.newPassword;
    const {id}= req.user;
    await this.User.findOne({where:{id}})   
    .then((user)=>{
      user.update({password:newPassword});
      user.save();
      this.response({res, message:"password changed!" , data:user});
    }).catch((err)=>console.log(err.message));
   
    
  }


})();
