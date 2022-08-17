const autoBind = require('auto-bind')
const {validationResult} = require('express-validator')
// const User= require('./../models/user')
// const Credit=require('./../models/credit')
// const License=require('./../models/license')
const Controles = require("../models/controls");
const Eblaghieh = require("../models/eblaghieh");
const Material = require("../models/material");
const Mission = require("../models/Mission");
const Station = require("../models/station");
const User = require("../models/user");

module.exports = class {
  constructor() {
    autoBind(this);
    // this.User = User;
    // this.Credit = Credit;
    // this.License = License;
    this.Controles= Controles;
    this.Eblaghieh = Eblaghieh;
    this.Material = Material;
    this.Mission = Mission;
    this.Station = Station;
    this.User = User;
  }

validationBody(req ,res){
    const result = validationResult(req);
    if(!result.isEmpty()){
        const errors = result.array();
        const messages=[];
        errors.forEach(err=>messages.push(err.msg));
        res.status(400).json({
            message:"validation errors",
            data:messages
        })
        return false;
    }
    return true;
}
validate(req , res ,next){
    if(!this.validationBody(req ,res)){
        return;
    
    }
    next();
}

response({res, message, code=200,success=true, data={}}){
    res.status(code).json({
        message,
        data,
        success
    });

   
}

getExpireDate(creditType){
    console.log("creditType in Expiredate" , creditType);    
    let expireDate = new Date();
    if(creditType === 1) expireDate.setDate(expireDate.getDate() + 7);
    if(creditType === 2) expireDate.setDate(expireDate.getDate() +14);
    if(creditType === 3) expireDate.setDate(expireDate.getDate() + 30);
    if(creditType === 4) expireDate.setDate(expireDate.getDate() + 10*366);
   console.log('expire date ' , expireDate);
    return expireDate;
  } ;

pagination(data){
    const totalPage = Math.ceil(data.count / data.perPage);
    const totalPerPage = data.perPage;
    const currentPage = data.page;
    const previousPage = currentPage == 1 ? null : currentPage -1;
    const nextPage = currentPage == totalPage ? null : currentPage +1;

    const result ={
        data:data.data,
        pagination:{
            totalRecords:data.count,
            totalPerPage,
            totalPage,
            currentPage,
            nextPage,
            previousPage
        }
    };
    return result
} 

};
