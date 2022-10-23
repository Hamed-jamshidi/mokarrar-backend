const controller = require("../controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { orderBy, first, result, isObject } = require("lodash");

const { Op } = require("@sequelize/core");
const { Sequelize, literal, where } = require("sequelize");
const { search } = require(".");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../../startup/db");

const upsert = async (Model, values, condition) => {
  const obj = await Model.findOne({
    where: condition,
  });
  if (obj) {
    return obj.update(values);
  }
  return Model.create(values);
};
module.exports = new (class extends controller {
  async getAllProducts(req, res) {
    try {
      const { partition } = req.user;
      const cards = req.params.cards;
      // const query = `select * from Products where partition=${partition} and close=${cards}`;
      // const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      const result = await this.Products.findAll({include: this.Processes, where:{partition:partition , close:cards}})
      this.response({res, message: "ok", data: result });          
    } catch (error) {
      console.log(error);
    }
  }
  async getProcess(req, res) {
    try {
      // const { partition } = req.user;
      const batchNum = "'" + req.params.batchNum + "'";
      console.log("batch num : ", batchNum);
      const query = `select * from Processes where batchNumber=${batchNum}`;
      const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      this.response({ res, message: "ok", data: result });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProcess(req, res) {
    try {
      const batchNum = "'"+req.params.batchNum+"'";
      console.log("batch num : ",batchNum)
      const query = `select * from Processes where batchNumber=${batchNum}`;
      const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      this.response({ res, message: "ok", data: result });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProcess(req, res) {
  try {
    const id = req.params.processId;
    const  { accessLevel} = req.user;
    if (accessLevel == 2 ){      
      const query =`DELETE FROM processes where id = ${id}`;
      await sequelize.query(query, { type: QueryTypes.DELETE })
      .then((resp)=>{
           this.response({res ,message:"DELETED!" , data:resp})
      })
      .catch((err)=>{console.log(err.message)})
    }else{
      this.response({res, message:"no access" , data:id})
    }
   
    
 
     
  }catch(err){
   console.log(err.message)
  }

  }
  async deleteEblaghiat(req, res) {
    try {
      const { accessLevel, partition } = req.user;
      //access lavel => admin =1 , modir = 2 , qc = 3 , operator = 4
      //partition => acrylic = 1 , epoxy = 2 , recycle =3 , polyurtan = 4, shimiaee = 5
      if (accessLevel === 2) {
        const id = req.params.eblagheId;
        const eblagh = await this.Eblaghieh.findOne({ where: { id } });
        if (eblagh !== null) {
          const eblagie_partition = eblagh.partition;
          const eblagie_close = eblagh.close;

          if (!eblagie_close && eblagie_partition === partition) {
            const query = `delete from eblaghies where id=${id}`;
            const result = await sequelize.query(query, {
              type: QueryTypes.DELETE,
            });
            this.response({
              res,
              message: "this row is deleted!",
              data: result,
            });
          } else {
            eblagie_close &&
              this.response({
                res,
                message: "this row is closed!",
                data: eblagh,
              });
            eblagie_partition !== partition &&
              this.response({
                res,
                message: "you cant delete from another partition!",
                data: eblagh,
              });
          }
        } else
          this.response({
            res,
            message: "this row isn't exist!",
            data: eblagh,
          });

        //   const query = `delete from eblaghies where id=${id}`;
        //   const result = await sequelize.query(query, { type: QueryTypes.DELETE });
        //   this.response({ res, message: "row deleted!", data: result });
        // }
        // else this.response({res , message:"this id isnt exists!", data: eblagh})
      } else
        this.response({
          res,
          message: "you haven't manager access",
          data: accessLevel,
        });

      // const id = req.params.eblagheId;
      // const eblagh = await this.Eblaghieh.findOne({id})
      // if(eblagh !== null){
      //   const query = `delete from eblaghies where id=${id}`;
      //   const result = await sequelize.query(query, { type: QueryTypes.DELETE });
      //   this.response({ res, message: "row deleted!", data: result });
      // }
      // else this.response({res , message:"this id isnt exists!", data: eblagh})
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct(req, res) {
    try {
      const { accessLevel, partition } = req.user;
      console.log(partition, accessLevel);
      //access lavel => admin =1 , modir = 2 , qc = 3 , operator = 4
      //partition => acrylic = 1 , epoxy = 2 , recycle =3 , polyurtan = 4, shimiaee = 5
      const {
        productName,
        batchNumber,
        batchValue,
        customerName,
        produtionType,
        startDate,
        sayDate,
        close,
      } = req.body;

      const values = {
        productName,
        partition,
        batchNumber,
        batchValue,
        customerName,
        produtionType,
        startDate,
        sayDate,
        close,
      };
      const conditons = {
        batchNumber,
      };
      const [product, created] = await this.Products.findOrCreate({
        where: conditons,
        defaults: values,
      });
      console.log(created);
      created
        ? this.response({
            res,
            message: "new eblaghie created!",
            data: product,
          })
        : this.response({
            res,
            message: "this batch number already exist!",
            data: created,
          });
    } catch (error) {
      console.log(error.message);
    }
  }

  async createProcess(req, res) {
    try {
      const { accessLevel, partition } = req.user;
      console.log(partition, accessLevel);
      //access lavel => admin =1 , modir = 2 , qc = 3 , operator = 4
      //partition => acrylic = 1 , epoxy = 2 , recycle =3 , polyurtan = 4, shimiaee = 5
      const {
        batchNumber,
        actionName,
        controllerName,
        operatorName,
        stationName,
        acceptValue,
        result,
        materialName,
        measuredValue,
        identifyCode,
        startTime,
        endTime,
      } = req.body;
      console.log( batchNumber,
        actionName,
        controllerName,
        operatorName,
        stationName,
        acceptValue,
        result,
        materialName,
        measuredValue,
        identifyCode,
        startTime,
        endTime)
      const FindProduct = await this.Products.findOne({
        where: { batchNumber },
      });
      console.log(FindProduct)
      if (FindProduct) {
        const values = {
          batchNumber,
          actionName,
          controllerName,
          operatorName,
          stationName,
          acceptValue,
          result,
          materialName,
          measuredValue, 
          identifyCode,
          startTime,
          endTime,
          productId: FindProduct.id,
        };
        console.log("values " ,values);
        await this.Processes.create(values)
          .then((response) =>
            this.response({
              res,
              message: "new process created!",
              data: response,
            })
          )
          .catch((error) => {
            console.log(error.message);
            this.response({
              res,
              message:"your process dont created!",
              data: error.message,
            });
          });
      }
 
      const conditons = {
        batchNumber, 
      };

      // console.log(FindProduct);
      // await FindProduct.createProcesses({values})
      //  await this.Processes.create({
      //   values
      //   }, {
      //     include: [{
      //       model: this.Products,

      //     }]
      //   })
      // .then((product)=>product.createProcess({values}))
      // .catch((err)=>console.log(err.message));
      // const [product, created] = await this.Processes.create({values} , {include:[this.Products]})
      // //   // where: conditons,
      // //   defaults: values,
      // // });
      // console.log(created);
      // created
      //   ? this.response({
      //       res,
      //       message: "new eblaghie created!",
      //       data: product,
      //     })
      //   : this.response({
      //       res,
      //       message: "this batch number already exist!",
      //       data: created,
      //     });
    } catch (error) {
      console.log(error.message);
    }
  }

  async createNewEblaghie(req, res) {
    try {
      const { accessLevel, partition } = req.user;
      console.log(partition, accessLevel);
      //access lavel => admin =1 , modir = 2 , qc = 3 , operator = 4
      //partition => acrylic = 1 , epoxy = 2 , recycle =3 , polyurtan = 4, shimiaee = 5
      const {
        productName,
        batchNumber,
        batchValue,
        customerName,
        produtType,
        startDate,
        sayDate,
        actionName,
        controllerName,
        operatorName,
        stationName,
        acceptValue,
        result,
        materialName,
        measuredValue,
        identifyCode,
        startTime,
        endTime,
        close,
      } = req.body;

      const values = {
        productName,
        partition,
        batchNumber,
        batchValue,
        customerName,
        produtType,
        startDate,
        sayDate,
        actionName,
        controllerName,
        operatorName,
        stationName,
        acceptValue,
        result,
        materialName,
        measuredValue,
        identifyCode,
        startTime,
        endTime,
        close,
      };
      const conditons = {
        batchNumber,
      };
      const [eblaghie, created] = await this.Eblaghieh.findOrCreate({
        where: conditons,
        defaults: values,
      });
      console.log(created);
      created
        ? this.response({
            res,
            message: "new eblaghie created!",
            data: eblaghie,
          })
        : this.response({
            res,
            message: "this batch number already exist!",
            data: created,
          });
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateProcess(req, res) {
    try {
      const {
        id,
        batchNumber,
        actionName,
        controllerName,
        operatorName,
        stationName,
        acceptValue,
        materialName,
        measuredValue,
        identifyCode,
        startTime,
        endTime,
        result,
      } = req.body;
      // const values = req.body;
      // console.log( "distructure" ,{id , batchNumber , actionName, controllerName , operatorName , stationName , acceptValue , result })
      // console.log("values", values );
      const response = await this.Processes.update(
        {
          id,
          batchNumber,
          actionName,
          controllerName,
          operatorName,
          stationName,
          acceptValue,
          materialName,
          measuredValue,
          identifyCode,
          startTime,
          endTime,
          result,
        },
        { where: { id } }
      );
      if (response[0])
        this.response({
          res,
          message: "this record is updated!",
          data: response,
        });
      else this.response({ res, message: "update failed!", data: result });
    } catch (error) {
      console.log(error.message);
    }
  }
  async updateProduct(req, res) {
    try {
      const values = req.body;
      const result = await this.Products.update(values, {
        where: { id: values.id },
      });
      if (result[0])
        this.response({
          res,
          message: "this record is updated!",
          data: result,
        });
      else this.response({ res, message: "update failed!", data: result });
    } catch (error) {
      console.log(error.message);
    }
  }
})();
