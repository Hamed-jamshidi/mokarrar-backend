const controller = require('./../controller');
const { Op } = require('@sequelize/core');
const _ = require('lodash');
const { count } = require('../../models/credit');
const sequelize =require('../../../startup/db')

module.exports = new (class extends controller {
  async dashboard(req, res) {
    res.send("user dashboard");
  }

  async me(req, res) {
  this.response({res,data:_.pick(req.user,["name" , "email"])})

}
  async filterUserName(req, res) {
  const searchUserName = req.body.userName;
  const listOfUserName =  await this.User.findAll({attributes:['id' , 'firstname' , 'lastname']     ,where:{[Op.or]:[{firstname:{[Op.like]:"%"+searchUserName+"%"} },{ lastname:{[Op.like]:"%"+searchUserName+"%"}}] },limit:10});
  

  this.response({res,data:listOfUserName})
  

}


async percentUserPerCrdit(req ,res){
  const result = await this.Credit.findAll({attributes:["credit_type" ,[sequelize.fn("SUM", sequelize.col("credit_type")), "sumCredit"],[sequelize.fn("COUNT", sequelize.col("credit_type")), "countCredit"]],  group:[ 'credit_type']});
  this.response({res ,message:"success", data:result})
}

  
})()
 