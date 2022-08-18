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
  async sayHello(req, res) {
    this.response({ res, message: "hello!", data: { message: "hello" } });
    console.log("hello firest api");
  }

  async register(req, res) {
    try {
      const {firstName ,lastName ,userName , password , accessLevel , partition } = req.body;
      const salt = await bcrypt.genSalt(10)
      const encriptedPassword= await bcrypt.hash(password, salt)
     
      const [user, created] = await this.User.findOrCreate({
        where: { username: userName },
        defaults: {
          firstname: firstName,
          lastname: lastName,
          username: userName,
          password: encriptedPassword,
          accessLevel: accessLevel,
          partition: partition,
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

  async login(req, res) {
    console.log('req.body', req.body)
    
    //  throw new Error('login faild');
    const user = await this.User.findOne({ where: { username: req.body.username } });
    console.log('user in the login ' , user);
    if (!user) {
      return this.response({
        res,
        code: 400,
        message: 'invalid email or password',
      })
    }
    const inValid = await bcrypt.compare(req.body.password, user.password)
    if (!inValid) {
      return this.response({
        res,
        code: 400,
        message: 'invalid email or password',
      })
    }
    const token = jwt.sign({ _id: user.id }, config.get('jwt_key'))
    this.response({ res, message: 'successful loged in ', data:{"success":true , "token":token}})
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
    const{userName , password} = req.body
    const user = await this.User.findOne({ where: { username: userName } });
    console.log('user in the login ' , user);
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
    this.response({ res, message: 'successful loged in ', data:{"success":true , "token":token}})
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


  // async getAllUsers(req, res) {
  //   try{
  //     const where={};
  //     const page = req.query.page ? parseInt(req.query.page) : 1;
  //     const perPage = req.query.limit ? parseInt(req.query.limit) : 1;

  //    const {count ,rows} = await this.User.findAndCountAll({
  //      order:[['firstname' ,'ASC'],['lastname','ASC']],
  //      offset:(page -1) * page,
  //      limit:perPage,
  //      distinct:true,});
  //      console.log(this.pagination);
  //      const result = this.pagination({
  //        data:rows,
  //        count,
  //        page,
  //        perPage
  //      })
  //     if(count <= 0){
  //       this.response({res ,code:404,message:"user not found" ,data:rows});
  //     }
  //     this.response({res, message:"ok", data:result});
  //   }catch(err){
  //     console.log(err.message);
  //   }

  // }

  //   async getAllLicenses(req ,res){
  //     try {
  //         const creditType = parseInt(req.query.creditType)
  //         console.log(creditType)
  //         const result = await sequelize.query(`SELECT count(*) AS count_all, CASE WHEN (julianday('now') - julianday(expire_date))>= 0 then 3 else (CASE WHEN (julianday('now') - julianday(expire_date))< 0
  //         AND  (julianday('now') - julianday(expire_date))>-3 THEN 2 else 1 end) end as status FROM licenses WHERE credit_type=${creditType} GROUP BY status`,{ type: QueryTypes.SELECT })
  //        this.response({res , message:'ok', data:result})
  //     }catch(error){
  //       console.log(error)
  //     }
  //   }

  //   async getUserNameById(req ,res){
  //     const userId = req.params.userId;
  //     console.log('userId in get user by id ' , userId);
  //     this.User.findOne({
  //       attributes:[[sequelize.literal("firstname || ' ' || lastname"),"fullName"],"username"],
  //       where:{id:userId}})
  //     .then(user=>this.response({res ,message:"ok", data:user}))
  //     .catch(err=>console.log(err.message));
  //   }

  //   async getListOfLicenseWithType(req, res) {

  //     let today =  new Date()
  //     let start =  new Date(today.getTime()-7*24*60*60*1000)
  //     // let nextweek = new Date(today.getTime()+8*24*60*60*1000)

  //     console.log('req query ', req.query)
  //     const creditType = req.query.creditType
  //     const productType = req.query.productType
  //     const licenseList = await this.License.findAll({
  //       attributes: [
  //         'createdAt','product_type', 'credit_type',
  //         [
  //           sequelize.fn('COUNT', sequelize.col('createdAt')),
  //           'license_type_count',
  //         ],
  //         [sequelize.literal(`(SELECT strftime('%w' , createdAt))`),'weekday']
  //       ],
  //       where: {
  //         product_type: 1,
  //         credit_type: creditType,
  //         createdAt: { [Op.between]: [start, today] },
  //       },
  //       group: 'createdAt',
  //     })

  //     // const licenseList = await sequelize.query(
  //     //   `SELECT createdAt , product_type , credit_type FROM licenseS WHERE credit_type=${creditType} AND product_type=${productType} AND createdAt BETWEEN ${today} AND ${nextweek} `,
  //     //   { type: sequelize.QueryTypes.SELECT}
  //     //      ).catch(err =>console.log(err))
  //     this.response({ res, message: 'success', data: licenseList })
  //     // const licenseList = await this.License.findAll({include:[ "product_type", "credit_type"],
  //     //   where: {product_type : productType , credit_type : creditType, createdAt:{[Op.between]:[today , today+7*24*60*60*1000 ]}},

  //     // });
  //     // this.response({ res, message: 'success', data: licenseList })
  //   }

  //   async dashboard(req, res) {
  //     res.send('admin dashboard')
  //   }

  //   async getCreditList(req, res) {
  //     const creditType = parseInt(req.params.creditType)
  //     console.log('creditType', creditType)
  //     let creditList = []
  //     if (creditType === 0) {
  //       //  creditList=await this.Credit.findAndCountAll()

  //       console.log('credit list here 0')
  //       creditList = await this.Credit.findAll({
  //         attributes: [
  //           'credit_type',
  //           [
  //             sequelize.fn('COUNT', sequelize.col('credit_type')),
  //             'credit_type_count',
  //           ],
  //         ],
  //         group: 'credit_type',
  //       })
  //     } else if (creditType === 1) {
  //     } else if (creditType === 2) {
  //     }
  //     console.log('credit list ', creditList)
  //     this.response({ res, message: 'ok', data: creditList })
  //   }

  //   async getCreditsList(req, res) {
  //     const creditType = parseInt(req.params.creditType)
  //     console.log('creditType', creditType)

  //     //  creditList=await this.Credit.findAndCountAll()

  //     console.log('credit list here 0')
  //     const creditList = await this.Credit.findAll({
  //       where: { credit_type: creditType },
  //       include: this.User,
  //     }).then((user) => {
  //       console.log('credit list ', user)
  //       this.response({ res, message: 'ok', data: user })
  //     })
  //   }

  //   async getLicenseList(req, res) {
  //     try{
  //       const page = req.query.page ? parseInt(req.query.page) : 1;
  //       const perPage = req.query.limit ? parseInt(req.query.limit) : 1;
  //     const licenseType = parseInt(req.params.licenseType)
  //     console.log('creditType', licenseType)

  //     //  creditList=await this.Credit.findAndCountAll()

  //     console.log('credit list here 0')
  //     const {count ,rows} = await this.License.findAndCountAll({
  //       order:[['credit_type' ,'ASC'],['id','ASC']],
  //       offset:(page -1) * perPage,
  //       limit:perPage,
  //       distinct:true,
  //       where: { credit_type: 1, product_type: 1 },
  //       include: this.User,
  //     });
  //     console.log(this.pagination);
  //        const result = this.pagination({
  //          data:rows,
  //          count,
  //          page,
  //          perPage
  //        })
  //       if(count <= 0){
  //         this.response({res ,code:404,message:"user not found" ,data:rows});
  //       }
  //       this.response({res, message:"ok", data:result});

  //     }catch(err){
  //       console.log(err);
  //     }

  //   }

  //   async getUserInfo(req, res) {
  //     const userId = parseInt(req.params.userId);
  //     console.log("userIddddddddddddddddddd" , userId);
  //     const userInfo = await this.User.findAll({
  //       where: { id: userId },
  //     }).catch((err) => console.log(err.message))
  //     console.log('license ', userInfo)
  //     this.response({ res, message: 'ok', data: userInfo })
  //   }

  //   async getUserLicenseList(req, res) {
  //     try{
  //     const page = req.query.page ? parseInt(req.query.page) : 1;
  //     const perPage = req.query.limit ? parseInt(req.query.limit) : 1;
  //     const userId = parseInt(req.params.userId)
  //     console.log('userid', userId)
  //     const {count ,rows} = await this.License.findAndCountAll({
  //       where: { userId: userId },
  //       order:[['id' ,'ASC'],['credit_type','ASC']],
  //       offset:(page -1) * page,
  //       limit:perPage,
  //       distinct:true,});
  //       console.log(this.pagination);
  //       const result = this.pagination({
  //         data:rows,
  //         count,
  //         page,
  //         perPage
  //       })
  //      if(count <= 0){
  //        this.response({res ,code:404,message:"user not found" ,data:rows});
  //      }
  //      this.response({res, message:"ok", data:result});
  //    }catch(err){
  //      console.log(err.message);
  //    }
  //   }

  //   async getUserCreditList(req, res) {
  //     const userId = parseInt(req.params.userId)

  //     console.log('user1111111111111111', userId)
  //     await this.Credit.findAll({ where: { userId: userId } })
  //        .then((credit) => {
  //         console.log('credit', credit)
  //         this.response({ res, message: 'ok', data: credit })
  //       })
  //       .catch((err) => console.log(err.message))
  //   }

  //   async getCreditChartData(req, res) {
  //     // console.log('req params ' , req.query);
  //     // this.response({res ,message:'ok ', data:req.query.type})
  //     const creditType = parseInt(req.query.type)
  //     const time = parseInt(req.query.time)
  //     const today = new Date()
  //     const week = new Date() - 6 * 24 * 60 * 60 * 1000
  //     const month = new Date() - 30 * 24 * 60 * 60 * 1000
  //     if (time === 1) {
  //       await this.Credit.findAll({
  //         attributes: [
  //           [sequelize.literal(`(select strftime('%w',createdAt))`), 'createdAtDay'],
  //           [
  //             sequelize.fn('COUNT', sequelize.col('credit_Type')),
  //             'credit_type_count',
  //           ],
  //         ],
  //         where: {
  //           product_type: 1,
  //           credit_type: creditType,
  //           createdAt: { [Op.between]: [week, today] },
  //         },
  //         group: 'createdAt',
  //       })
  //         .then((license) => this.response({ res, message: 'ok', data: license }))
  //         .catch((err) => console.log(err.message))
  //     } else if (time === 2) {
  //       this.Credit.findAll({
  //         attributes: [
  //           'createdAt',
  //           [
  //             sequelize.fn('COUNT', sequelize.col('createdAt')),
  //             'credit_type_count',
  //           ],
  //         ],
  //         where: {
  //           product_type: 1,
  //           credit_type: creditType,
  //           createdAt: {[Op.between]: [month, today] },
  //         },
  //         group: 'createdAt',
  //       })
  //         .then((license) => this.response({ res, message: 'ok', data: license }))
  //         .catch((err) => console.log(err.message))
  //     }
  //   }

  //   async getLicenseChartData(req, res) {
  //     // console.log('req params ' , req.query);
  //     // this.response({res ,message:'ok ', data:req.query.type})
  //     const creditType = parseInt(req.query.type)
  //     const time = parseInt(req.query.time)
  //     const today = new Date()
  //     const week = new Date() - 7 * 24 * 60 * 60 * 1000
  //     const month = new Date() - 30 * 24 * 60 * 60 * 1000
  //     if (time === 1) {
  //       await this.License.findAll({
  //         attributes: [
  //           'createdAt',
  //           [
  //             sequelize.fn('COUNT', sequelize.col('createdAt')),
  //             'credit_type_count',
  //           ],
  //         ],
  //         where: {
  //           product_type: 1,
  //           credit_type: creditType,
  //           createdAt: { [Op.between]: [week, today] },
  //         },
  //         group: 'createdAt',
  //       })
  //         .then((license) => this.response({ res, message: 'ok', data: license }))
  //         .catch((err) => console.log(err.message))
  //     } else if (time === 2) {
  //       this.License.findAll({
  //         attributes: [
  //           'createdAt',
  //           [
  //             sequelize.fn('COUNT', sequelize.col('createdAt')),
  //             'credit_type_count',
  //           ],
  //         ],
  //         where: {
  //           product_type: 1,
  //           credit_type: creditType,
  //           createdAt: { [Op.between]: [month, today] },
  //         },
  //         group: 'createdAt',
  //       })
  //         .then((license) => this.response({ res, message: 'ok', data: license }))
  //         .catch((err) => console.log(err.message))
  //     }
  //   }

  //   async updateCredit(req, res) {
  //     const credit = req.body
  //     console.log("credit........" , credit)

  //     const result = await this.Credit.update({
  //       maximum_camera_count:credit.cameraCount,
  //       credit_count:credit.creditCount},
  //       {where:{
  //         id:credit.id
  //       }})
  //     console.log('credit', result)
  //     this.response({ res, message: 'ok', data: result })
  //   }

  //   async getUserNameData(req, res) {
  //     const searchData = req.params.searchData
  //     console.log('search data', searchData)
  //     await this.User.findAll({
  //       where: Sequelize.where(
  //         sequelize.literal("firstname || ' ' || lastname "),
  //         { [Op.like]: '%' + searchData + '%' },
  //       ),
  //     })

  //       .then((user) => this.response({ res, message: 'ok', data: user }))
  //       .catch((err) => console.log(err.message))
  //   }

  //   async getLicenseListFiltered(req, res) {
  //     // query params
  //     function isObject(val) {
  //       return val instanceof Object;
  //   }
  //     let userIdFirst = [10000000]
  //     let statusFilter =[1,2,3]
  //     const where ={};
  //     console.log('req body ,,,,,,,,,',req.body.dataFiltered )
  //     if( Object.keys(req.body.dataFiltered).length !== 0) {
  //       const {productType ,
  //         creditType ,
  //         userId ,
  //         status ,
  //         createDate ,
  //         description ,
  //         cameraCount } = req.body.dataFiltered;
  //         console.log('data in', productType,createDate,creditType,userId,status,description,cameraCount);
  //    // where conditional
  //   userIdFirst=userId;
  //   where.createdAt = {[Op.lt]:createDate};
  //   if(productType.length !== 2 && productType.length !== 0) where.product_type = {[Op.in]:productType};
  //   if(status.length !== 0 && status.length !== 3) statusFilter=status;
  //   if(creditType.length !== 4 && creditType.length !== 0) where.credit_type = {[Op.in]:creditType};
  //   if(description !== "") where.description = {[Op.like]:`%${description}%`};
  //   if(cameraCount) where.camera_count = {[Op.between]:cameraCount};
  //     }

  //     console.log("where :" , where);

  //     try {
  //       const page = req.query.page ? parseInt(req.query.page) : 1;
  //       const perPage = req.query.limit ? parseInt(req.query.limit) : 1;
  //       const  {count ,rows} =  await this.License.findAndCountAll({
  //         attributes: {
  //             include: [
  //                 [
  //                     // Note the wrapping parentheses in the call below!
  //                     sequelize.literal(`(
  //                       SELECT CASE WHEN (julianday('now') - julianday(expire_date))>= 0 then 1 else
  //                       (CASE WHEN

  //                        (julianday('now') - julianday(expire_date))< 0
  //                        and  (julianday('now') - julianday(expire_date))>-3

  //                        then 2 else 3 end) end
  //                     )`),
  //                     'status'
  //                 ]
  //             ]
  //         },
  //         where:{[Op.and]:[where ,Sequelize.where( sequelize.literal(`(
  //           SELECT CASE WHEN (julianday('now') - julianday(expire_date))>= 0 then 1 else
  //           (CASE WHEN
  //            (julianday('now') - julianday(expire_date))< 0
  //            and  (julianday('now') - julianday(expire_date))>-3
  //            then 2 else 3 end) end
  //         )`), {[Op.in]: statusFilter}) ]},
  //         include: [
  //               {
  //                 model: this.User,
  //                 attributes: ['id', 'firstname', 'lastname'],
  //                 where: { id: {[Op.in]:userIdFirst } },
  //               },
  //             ], order:[['id' ,'ASC'],['credit_type','ASC']],
  //             offset:(page -1) * perPage,
  //             limit:perPage,
  //             distinct:true,
  //     });
  //     console.log("count ,,,,,," ,count , rows )
  //     console.log(this.pagination);
  //     const result = this.pagination({
  //       data:rows,
  //       count,
  //       page,
  //       perPage
  //     })
  //   //  if(count <= 0){
  //   //    this.response({res ,code:404,message:"user not found" ,data:rows});
  //   //  }
  //    this.response({res, message:"ok", data:result});
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  //   async changePasswordUser(req ,res){
  //     const newPassword = req.body.newPassword;
  //     console.log('new password' , newPassword)
  //     const salt = await bcrypt.genSalt(10)
  //     const  hashedPassword = await bcrypt.hash(newPassword, salt)
  //     console.log('password',hashedPassword )
  //     await this.User.update({password:hashedPassword},{where:{id:req.body.userId}})
  //     .then((result) =>this.response({res , message:"رمز شما با موفقیت تغییر یافت " }))
  //     .catch(err=>console.log(err.message))
  //   }

  //  async deleteCredit(req ,res){
  //    const credit = req.body;
  //    console.log('credit ' , credit);
  //    await this.Credit.destroy({where:{id:parseInt(credit.id)}})
  //    .then(this.response({res , message:"credit deleted!" }))
  //    .catch(err=>console.log(err.message));
  //  }

  //  async createNewCredit(req , res){
  //    const credit = req.body;
  //    console.log("credit" , credit);
  //    const expireDate =this.getExpireDate(parseInt(credit.creditType));
  //    await this.Credit.create(
  //      {userId:credit.userId,
  //        product_type:credit.productType,
  //       credit_type:credit.creditType,
  //       maximum_camera_count:credit.maxCameraCount,
  //     credit_count:credit.creditCount,
  //   expire_date:expireDate})
  //   .then(result=>this.response({res, message:"ok", data:result}))
  //   .catch(err =>console.log(err.message));
  //   //  await this.Credit.destroy({where:{id:parseInt(credit.id)}})
  //   //  .then(this.response({res , message:"credit deleted!" }))
  //   //  .catch(err=>console.log(err.message));
  //  }

  //  async calcPercentCreditType(req ,res){
  //    const creditType =parseInt(req.query.creditType);
  //    console.log(creditType)
  //    try{
  //      const result= await sequelize.query(`select status, myCount,sum(myCount) over() as total, (cast(myCount as float)/(sum(myCount) over()))*100 as percentage from (select count(status) as myCount , status from (SELECT expire_date ,CASE WHEN (julianday('now') - julianday(expire_date))>= 0 then 3 else
  //      (CASE WHEN (julianday('now') - julianday(expire_date))< 0 and  (julianday('now') - julianday(expire_date))>-3 then 2 else 1 end) end as status  from licenses where credit_type=${creditType}) group by status) group by status`,{ type: QueryTypes.SELECT });
  //      console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",result)
  //      this.response({res ,message:"ok", data:result})

  //    }catch(error){
  //           console.log(error)
  //    }
  //  }

  //  async deleteCreditById(req ,res){

  //    try{
  //     const creditId = parseInt(req.params.creditId);
  //     console.log(creditId)
  //      const result = await this.Credit.destroy({where:{id:creditId}});
  //      this.response({res , message:"ok" , data:result})
  //    }catch(err){
  //      console.log(err)
  //    }
  //  }
})();
