const controller = require('./../controller')
const _ = require('lodash')
const { sequelize } = require('../../models/credit')
const Credit = require('./../../models/license')
const config = require('config')
const axios = require('axios')
const { Op } = require('@sequelize/core');
const { result } = require('lodash')
const { parse } = require('querystring')
const { count } = require('console')
const { Sequelize, literal } = require('sequelize')
module.exports = new (class extends controller {
  async generateLicense(req, res) {
    console.log('credit insert', req.user.id)
    const userId = req.user.id
    console.log('userId ', userId)
    const licenseData = req.body
    const timeDelta = this.getTimedelta(licenseData.credit_type)
    console.log('timeDelta', timeDelta) 
    try {
      const expireDate = this.timeToDate(timeDelta)
      console.log('expireDate ', expireDate)
     const hasUserCredit = this.hasCredit(userId ,licenseData.credit_type ,licenseData.camera_count ,licenseData.product_type);
     
      if (hasUserCredit) {
        const licenseGeneratorData = {
          user_key: licenseData.user_key,
          camera_count: licenseData.camera_count,
          expire_date: expireDate,
        }

         const response = await axios.post(config.license_generator_address,licenseGeneratorData,{auth:{"username":"admin","password":"admin@123"}})
         console.log("response", response)
        // const response = {
        //   success: true,
        //   license_info: { license: 'license', sys_id: 'sys id' },
        // }
        console.log('response', response)
        if (response.success) {
          const licenseCode = response.license_info['license']
          console.log('license_info.', response.license_info['license'])
          const sysId = response.license_info['sys_id']
          console.log('licenseCode', licenseCode)
          // console.log("sysId", this.checkLicenseExist(sysId , licenseData.product_type , licenseData.credit_type));
          const checklicense = await this.checkLicenseExist(
            sysId,
            licenseData.product_type,
            licenseData.credit_type,
          )
          console.log('checkliicense', checklicense)
          if (false) {
            const data = {
              success: false,
              error_code: -4,
              error_message: 'sys id is duplicate!',
            }
            this.response({ message: 'sys id is duplicate', data })
          }
          const info = {
            product_type: licenseData.product_type,
            camera_count: licenseData.camera_count,
            user_key: licenseData.user_key,
            expire_date: expireDate,
            license_code: licenseCode,
            credit_type: licenseData.credit_type,
            description: licenseData.description,
            sys_id: sysId

          }
          console.log('info', info)

          await this.User.findOne({ where: { id: userId } })
            .then(async (user) => {
              console.log('user', user)
              const result = await user.createLicense(info)
              console.log('rsult', result)
              const credit = await this.Credit.findOne({
                where: { userId: user.id, credit_type: result.credit_type },
              })
              console.log('credit license', credit)
              await credit.decrement({
                credit_count: result.camera_count,
              })
              console.log('credit')
              res.send(result)
              // })
              // .then((user) => {
              //   this.Credit(
              //     {
              //       credit_count:
              //         ParseInt(licenseData.credit_count) - parseInt(licenseData.camera_count),
              //     },
              //     { where: { userId: userId } },
              //   ).success(resutl =>console.log("update successfuly"))
              //   .error(err=>console.log(error.message));
              //   console.log("license",license)
              //   const data = { success: True, license_code: license_code }
              //   console.log('credit created', license)
              //   this.response({
              //     res,
              //     message: 'the license successfully generated!',
              //     data: data,
              //   })
            })
            //       .then(async (license)=>
            //       {await this.Credit.update(
            //         {
            //           credit_count:
            //             ParseInt(licenseData.credit_count) - parseInt(licenseData.camera_count),
            //         },
            //         { where: { userId: userId } });

            //  res.send(license);})
            .catch((err) =>
              res.send({
                success: false,
                error_code: -2,
                error_message: 'your request is incorrect',
              }),
            )
        }
      }
    } catch (err) {
      res.send({ succuss: false, error_code: -1, error_message: err.message })
    }
    // res.send('license generate');
  }

  getTimedelta(creditType) {
    // if(creditType == 1) return (Date.now() + 7 * 24 * 60 * 60 * 1000);
    // if(creditType == 2) return (Date.now() + 14 * 24 * 60 * 60 * 1000);
    // if(creditType == 3) return (Date.now() + 30 * 24 * 60 * 60 * 1000);
    // if(creditType == 40 ) return (Date.now() + 366 * 100 * 24 * 60 * 60 * 1000);
    if (creditType == 1) return 7
    if (creditType == 2) return 14
    if (creditType == 3) return 30
    if (creditType == 4) return 100
  }
  timeToDate(deltaTime) {
    const today = new Date()
    let expireTime1 = 0
    if (deltaTime == 7)
      expireTime1 = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 7,
      )
    if (deltaTime == 14)
      expireTime1 = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 14,
      )
    if (deltaTime == 30)
      expireTime1 = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
      )
    if (deltaTime == 100)
      expireTime1 = new Date(
        today.getFullYear() + 100,
        today.getMonth(),
        today.getDate(),
      )
    return "2022-05-12" 
    // console.log('expirteTime1', expireTime1)
    // const date = ('0' + expireTime1.getDate()).slice(-2)
    // const month = ('0' + (expireTime1.getMonth() + 1)).slice(-2)
    // const year = expireTime1.getFullYear()
    // return `${date}/${month}/${year}`
  }

  hasCredit = async (userId, creditType, cameraCount, productType) => {
    console.log('userId3 ', userId);
    const result = await this.Credit.findOne({where:{credit_type:creditType, product_type:productType},camera_count:{[Op.gt]:parseInt(cameraCount) }});
    return result;
    // console.log("result" , result);
    // return re
    // const result = await this.Credit.findOne({where:{userId:userId , credit_type:creditType , camera_count:cameraCount,product_type:productType}});
    // console.log('hasCredit result',result)
    // if(result == false || result.length === 0) return false;
    // return true;
  }
  checkLicenseExist = async (sysId, creditType, productType) => {
    console.log('checkLicesneExist')
    const result = await this.License.findOne({
      where: {
        sys_id: sysId,
        credit_type: creditType,
        product_type: productType,
      },
    })
    console.log('checkLicesneExist result', result)
    if (result) return false
    return true
  }

  async getLicenseList(req, res) {
    console.log('credit list', req.user.id)
    console.log('params  id ', req.params.productType)
    console.log('req qurey' , req.query);
    const licenses = await this.License.findAndCountAll({
      where: { userId: req.user.id, product_type: parseInt(req.params.productType) } ,offset:parseInt(req.query.offset), limit:parseInt(req.query.limit)
    })
   console.log('resutl in get list :' ,licenses.count);
    res.send([licenses.rows , licenses.count])
  };

  async filterLicenseAdmin(req, res) {
    // get data from body and get paging from url
    let filter = {};
    const queryResult= req.query;
    const bodyResult = req.body;    
    console.log("result body " , bodyResult.status);
    console.log("result query " , queryResult);
   if (bodyResult.userId !== null) filter = {...filter , userId:bodyResult.userId};
   if (bodyResult.productType !== null) filter = {...filter , product_type:bodyResult.productType};
   if (bodyResult.creditType !== null) filter = {...filter , credit_type:bodyResult.creditType};
   if (bodyResult.description !== null) filter = {...filter , description:{[Op.like]:"%"+bodyResult.description+"%"}};
  //  if (result.expire_date !== null) filter = {...filter , expire_date:{[Op.eq]:new Date(result.expire_date)}};   
  // filter base on status // active expire time > 3 days , disactive expiretime < 0 , warning expire time >0 and <3
   const today = new Date();
   if (bodyResult.status !== null ){ 
     if(bodyResult.status === "active")filter= {...filter , expire_date:{[Op.gt]:new Date(today.getTime()+3*24*60*60*1000)}}
     if(bodyResult.status === "pendding")filter= {...filter , expire_date:{[Op.lt]:new Date(today.getTime()+3*24*60*60*1000),[Op.gt]:new Date()}}
     if(bodyResult.status === "disactive")filter= {...filter , expire_date:{[Op.lt]:new Date()}}
   } 
    // find license on the filter 
 const licenses= await this.License.findAll({where:filter,offset:JSON.parse(queryResult.offset),limit:JSON.parse(queryResult.limit)})
 .then((licenses)=>this.response({res,message:"successfully",data:licenses}))
 .catch((err)=>res.send(err.message));
   
   


   //  if (bodyResult.status !== null ){
  //    if(JSON.parse(result.status) === "active")filter= {...filter , expire_date:{[Op.gt]:new Date(today.getTime()+3*24*60*60*1000)}}
  //    if(JSON.parse(result.status) === "pendding")filter= {...filter , expire_date:{[Op.lt]:new Date(today.getTime()+3*24*60*60*1000),[Op.gt]:new Date()}}
  //    if(JSON.parse(result.status) === "disactive")filter= {...filter , expire_date:{[Op.lt]:new Date()}}
  //  } 
  //  const today = new Date();
  //  if (result.status !== null ){
  //    if(JSON.parse(result.status) === "active")filter= {...filter , expire_date:{[Op.gt]:new Date(today.getTime()+3*24*60*60*1000)}}
  //    if(JSON.parse(result.status) === "pendding")filter= {...filter , expire_date:{[Op.lt]:new Date(today.getTime()+3*24*60*60*1000),[Op.gt]:new Date()}}
  //    if(JSON.parse(result.status) === "disactive")filter= {...filter , expire_date:{[Op.lt]:new Date()}}
  //  } 

}
  async filterLicense(req, res) {
    console.log('req user if ' , req.user.id);
    console.log('productTpype ' , req.body.productType);

    // get data from body and get paging from url
    let filter = {userId:req.user.id , product_type:req.body.productType };
    console.log('filter' , filter)
    const queryResult= req.query;
    const bodyResult = req.body;    
    console.log("result body " , bodyResult);
    console.log("result query " , queryResult);
  //  if (bodyResult.userId !== req.user.id) filter = {...filter , userId:bodyResult.userId};
  //  if (bodyResult.productType !== null) filter = {...filter , product_type:bodyResult.productType};
   if ((bodyResult.creditType !== null && bodyResult.creditType.length !== 0  &&     bodyResult.creditType.length !== 4))filter = {...filter , credit_type:bodyResult.creditType};
  
   if ((bodyResult.description !== null && bodyResult.description !== "" )) filter = {...filter , description:{[Op.like]:"%"+bodyResult.description+"%"}};

   
  
  //  if (result.expire_date !== null) filter = {...filter , expire_date:{[Op.eq]:new Date(result.expire_date)}};   
  // filter base on status // active expire time > 3 days , disactive expiretime < 0 , warning expire time >0 and <3
   const today = new Date();  
   

   if (bodyResult.status !==null  && bodyResult.status.length !== 3 && bodyResult.status.length !== 0){
    (bodyResult.status.includes(1) && (filter= {...filter , expire_date:{[Op.gt]:new Date(today.getTime()+3*24*60*60*1000)}}));
    (bodyResult.status.includes(3) && (filter= {...filter , expire_date:{[Op.lt]:new Date()}}));
    (bodyResult.status.includes(3) && bodyResult.status.includes(1) && (filter= {...filter , expire_date:{[Op.notBetween]:[new Date() , new Date(today.getTime()+3*24*60*60*1000) ]}}));
    (bodyResult.status.includes(2) && (filter= {...filter , expire_date:{[Op.lt]:new Date(today.getTime()+3*24*60*60*1000),[Op.gt]:new Date()}}));
    if(bodyResult.status.includes(2)){
      (bodyResult.status.includes(1) && (filter= {...filter , expire_date:{[Op.gt]:new Date()}}));
      (bodyResult.status.includes(3) && (filter= {...filter , expire_date:{[Op.lt]:new Date(today.getTime()+3*24*60*60*1000)}}));      
    }    
           
   
   } 
    let query ={};
   (queryResult.order !=='' ? (query = {where:filter , offset:parseInt(queryResult.offset)  , limit: parseInt(queryResult.limit)  , order:[[queryResult.order , 'DESC']]}):(query = {where:filter , offset:parseInt(queryResult.offset)  , limit: parseInt(queryResult.limit)}));
    // find license on the filter 
await this.License.findAll(query)
 .then(( licenses )=>
 {
   console.log('licenses' ,licenses)
 this.response({res,message:"successfully",data:licenses})
 }
 ) 
 .catch((err)=>res.send(err.message));

   
   


   //  if (bodyResult.status !== null ){
  //    if(JSON.parse(result.status) === "active")filter= {...filter , expire_date:{[Op.gt]:new Date(today.getTime()+3*24*60*60*1000)}}
  //    if(JSON.parse(result.status) === "pendding")filter= {...filter , expire_date:{[Op.lt]:new Date(today.getTime()+3*24*60*60*1000),[Op.gt]:new Date()}}
  //    if(JSON.parse(result.status) === "disactive")filter= {...filter , expire_date:{[Op.lt]:new Date()}}
  //  } 
  //  const today = new Date();
  //  if (result.status !== null ){
  //    if(JSON.parse(result.status) === "active")filter= {...filter , expire_date:{[Op.gt]:new Date(today.getTime()+3*24*60*60*1000)}}
  //    if(JSON.parse(result.status) === "pendding")filter= {...filter , expire_date:{[Op.lt]:new Date(today.getTime()+3*24*60*60*1000),[Op.gt]:new Date()}}
  //    if(JSON.parse(result.status) === "disactive")filter= {...filter , expire_date:{[Op.lt]:new Date()}}
  //  } 

}

async getLicenseListFiltered(req, res) {
  const userId = req.user.id;
  console.log("user id ,,,,", userId)
  // query params
  let statusFilter =[1,2,3]
  const {productType ,
        creditType ,        
        status ,
        createDate ,
        description ,
        cameraCount } = req.body;
        console.log('data in', productType,createDate,creditType,status,description,cameraCount);
   // where conditional  
  const where ={};
  where.createdAt = {[Op.lt]:createDate};
  if(productType.length !== 2 && productType.length !== 0) where.product_type = {[Op.in]:productType};
  if(status.length !== 0 && status.length !== 3) statusFilter=status;
  if(creditType.length !== 4 && creditType.length !== 0) where.credit_type = {[Op.in]:creditType};
  if(description !== "") where.description = {[Op.like]:`%${description}%`};
  if(cameraCount) where.camera_count = {[Op.between]:cameraCount}; 
  
  console.log("where :" , where);

  try {     
    const result =  await this.License.findAll({
      attributes: {
          include: [
              [
                  // Note the wrapping parentheses in the call below!
                  sequelize.literal(`(
                    SELECT CASE WHEN (julianday('now') - julianday(expire_date))>= 0 then 1 else 
                    (CASE WHEN
                    
                     (julianday('now') - julianday(expire_date))< 0
                     and  (julianday('now') - julianday(expire_date))>-3
                     
                     then 2 else 3 end) end 
                  )`),
                  'status'
              ]
          ]
      },
      where:{[Op.and]:[where ,Sequelize.where( sequelize.literal(`(
        SELECT CASE WHEN (julianday('now') - julianday(expire_date))>= 0 then 1 else 
        (CASE WHEN         
         (julianday('now') - julianday(expire_date))< 0
         and  (julianday('now') - julianday(expire_date))>-3           
         then 2 else 3 end) end 
      )`), {[Op.in]: statusFilter}) ]},
      include: [
            {
              model: this.User,
              attributes: ['id', 'firstname', 'lastname'],
              where: { id:userId },
            },
          ],
  });
    console.log('result :' , result)
    this.response({ res, message: 'ok', data: result })      
  } catch (err) { 
    console.log(err) 
  }
}



// fetch data of license type for show in the PiChart
async chartLicenseUser( req , res){
  let piData =[0 ,0 ,0];
  let barData=[[0,0,0] , [ 0,0,0] , [0,0,0] , [0,0,0]];
  const  today = new Date();
  const productType = parseInt(req.params.productType)
  const treeDaysLater = new Date(today.getTime()+3*24*60*60*1000);
  console.log('user id : ' , req.user.id);
  // query for pi chart
  const total = await this.License.findAndCountAll({where:{userId:req.user.id , product_type:productType}})
  // .then(result=> this.response({res , message:"successfully" , data:result.count}))
  if(total.count !== 0){
    const valid = await this.License.findAndCountAll({where:{userId:req.user.id , product_type:productType , expire_date:{[Op.gt] : treeDaysLater}}})
     // .then(result=> this.response({res , message:"successfully" , data:result.count}).catch(err=>res.send(err.message)))
    const warning = await this.License.findAndCountAll({where:{userId:req.user.id , product_type:productType , expire_date:{[Op.between]:[today,treeDaysLater] }}})
    // .then(result=> this.response({res , message:"successfully" , data:result.count}).catch(err=>res.send(err.message)))
    const invalid= await this.License.findAndCountAll({where:{userId:req.user.id , product_type:productType , expire_date : {[Op.lt]:today}}})
    // .then(result=> this.response({res , message:"successfully" , data:result.count}).catch(err=>res.send(err.message)))
    console.log('result license for charts' , [ total.count , valid.count , warning.count , invalid.count]);
    const validPercent=(valid.count/ total.count) * 100;
    const warningPercent=(warning.count/ total.count) * 100;
    const invalidPercent=(invalid.count/ total.count) * 100;
     piData = [ validPercent , warningPercent , invalidPercent] ;
  }
 
  // query for bar chart
  const countWeekExpireLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:1 , expire_date:{[Op.lt]:today}}})
  const countWeekWarningLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:1 , expire_date:{[Op.between]:[today , treeDaysLater]}}})
  const countWeekValidLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:1 , expire_date:{[Op.gt]:treeDaysLater}}})
  const countTowWeekExpireLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:2 , expire_date:{[Op.lt]:today}}})
  const countTowWeekWarningLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:2 , expire_date:{[Op.between]:[today , treeDaysLater]}}})
  const countTowWeekValidLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:2 , expire_date:{[Op.gt]:treeDaysLater}}})
  const countMonthExpireLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:3 , expire_date:{[Op.lt]:today}}})
  const countMonthWarningLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:3 , expire_date:{[Op.between]:[today , treeDaysLater]}}})
  const countMonthValidLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:3 , expire_date:{[Op.gt]:treeDaysLater}}})
  const countPermanentExpireLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:4 , expire_date:{[Op.lt]:today}}})
  const countPermanentWarningLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:4 , expire_date:{[Op.between]:[today , treeDaysLater]}}})
  const countPermanentValidLicense = await this.License.count({where:{userId:req.user.id , product_type:productType,credit_type:4 , expire_date:{[Op.gt]:treeDaysLater}}})
//  this.response({res , message:"successfully" , data:
  barData =[[countWeekExpireLicense,countWeekValidLicense, countWeekWarningLicense],
[countTowWeekExpireLicense ,countTowWeekValidLicense ,countTowWeekWarningLicense] ,
 [countMonthExpireLicense ,countMonthValidLicense , countMonthWarningLicense ] ,
[ countPermanentExpireLicense ,countPermanentValidLicense ,countPermanentWarningLicense]];


// });
this.response({res ,message:"successfully" , data:{ barData , piData }});
console.log("jsldjlfj" , barData)
// console.log("bar data " , barData);
// console.log("pi data " , piData); 
// const result = await this.License.findAll({
//   attributes: {
//       include: [
//           [
//               sequelize.literal(`(
//                   SELECT COUNT(*)
//                   FROM licenses AS license
//                   WHERE
//                       userId =${req.user.id}
//                       AND
                      
//               )`),
//               'credit_type'
//           ]
//       ]
//   },          attributes:[ , count] , where:{userId:req.user.id , product_type:productType, expire_date:{[Op.between]:[today , treeDaysLater]}} ,group:"credit_type"})
// .then((license) => {license.count({where:{product_type:1}});
// console.log('response ' , license)});
// this.response({res , message:"success", data:result });
// console.log('result bar chart ' , result);
}




})();
  

