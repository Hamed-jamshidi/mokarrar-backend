const controller = require('../controller')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const data = require('../../../public/defaultUserCredits.json')

module.exports = new (class extends controller {

// -------------register ---------------->
  async register(req, res) {
    // this.response({res, message:"hello",data:req })
    console.log('req_body', req.body)
    let user = await this.User.findOne({ where: { email: req.body.email } })
    console.log('user_req', user)
    if (user) {
      return this.response({
        res,
        code: 400,
        message: 'this user already registered',
      })
    }
    const { email, name, password } = req.body
    user = new this.User({ email, name, password });
    
    user = new this.User(
      _.pick(req.body, [
        'firstname',
        'lastname',
        'username',
        'email',
        'password',
        'isadmin'
      ]),
    )
    this.response({res , message:'hello ' , data:user})
    const dataUser = {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      password: user.password,
      isadmin:user.isadmin || false
    }

    const dataCredit1 = {
      credit_type: data.creditType,
      product_type: data.productType[0],
      maximum_camera_count: data.maximumCameraCount,
      credit_count: data.creditCount,
      expire_date: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }
    const dataCredit2 = {
      credit_type: data.creditType,
      product_type: data.productType[1],
      maximum_camera_count: data.maximumCameraCount,
      credit_count: data.creditCount,
      expire_date: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }

    console.log('user2', user)
    const salt = await bcrypt.genSalt(10)
    dataUser.password = await bcrypt.hash(dataUser.password, salt)
    console.log('password', user.password)
    return await this.User.create(dataUser)
      .then((user) => {
        console.log('user created', user)
        user.createCredit(dataCredit1)
        user.createCredit(dataCredit2)
      })
      .then((credit) => {
        console.log('credit created', credit);
        let dataUser =_.pick(user, ['_id', 'firstname', 'email']);
        
        this.response({
          res,
          message: 'the user sucessfully registred',
          data: {"data":_.pick(user, ['_id', 'firstname', 'email']), "success":true},
        })
      })
      .catch((err) => console.log(err.message))

  }



  // -------------------login ------------------->

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




  // -------------- change password --------------->
  
  
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



})()
