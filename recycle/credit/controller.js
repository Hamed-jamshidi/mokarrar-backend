const controller = require('./../controller')
const _ = require('lodash')
const Credit= require('./../../models/credit');

module.exports = new (class extends controller {
  async insertCredit(req, res) {
    console.log('credit insert',req.user.id);
    // const expire = 7;
    const today = new Date();
    // if(req.user.creditType === 2) expire =14;
    // if(req.user.creditType === 3) expire =30;
    // if(req.user.creditType === 4) expire =100*366;
    const updatecredit = await this.Credit.findOne({where:{userId:req.body.userId, product_type:req.body.productType, credit_type:req.body.creditType}})
    .then((updatecredit)=>{if(updatecredit !== null){
      updatecredit.update({maximum_camera_count:req.body.maximumCameraCount,credit_count:req.body.creditCount,expire_date:new Date(today.getTime()+req.body.expire_date * 24*60*60*1000)});
      updatecredit.save();
      this.response({res ,message:"update!", data:updatecredit})
    }else{
      async function createCredit({Credit,response}){
       const credit =  await Credit.create({userId:req.body.userId ,credit_type:req.body.creditType,product_type:req.body.productType,maximum_camera_count:req.body.maximumCameraCount,credit_count:req.body.creditCount,expire_date:new Date(today.getTime()+req.body.expire_date * 24*60*60*1000)});
       response({res , message:"created!" , data:credit});
      };
      createCredit({Credit:this.Credit , response:this.respones});
    }
    })
    .catch((err)=>res.send(err.message)); 
   


    // if(hasCredit){
    //   await this.Credit.update({where:{}})

    // }
  //   const creditData = req.body;
  //   if(creditData.user_id === null || creditData.user_id ===undefined ){
  //     const user = await this.User.findOne({where:{username:creditData.username}} )
  //     creditData.user_id = user.id;
  // //     insertCreditData={
  // //       "credit_type":"",
  // //       "product_type":"",
  // //       "maximum_camera_count":"",
  // //       "expire_dete":"",
        
  // //     }
  // //   }
   }
 


  async getCreditList(req, res) {
    try{
      console.log('credit list',req.user.id);
      console.log('params  id ', req.params.productId);
      const credits =await this.Credit.findAll({where:{userId:parseInt(req.user.id ), product_type:parseInt(req.params.productId)}})
      this.response({res , message:'ok', data:credits});
      
    }catch(err){
      console.log(err.message);
    }   

  } 
  
 
})()
 