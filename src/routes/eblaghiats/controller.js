const controller = require("../controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { orderBy, first, result, isObject } = require("lodash");

const { Op } = require("@sequelize/core");
const { Sequelize, literal, where } = require("sequelize");
const { search } = require(".");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../../startup/db");
const { condition } = require("sequelize");
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
  async getAllEblaghiat(req, res) {
    try {
      const { partition } = req.user;
      const query = `select * from eblaghies where partition=${partition}`;
      const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      this.response({ res, message: "ok", data: result });
    } catch (error) {
      console.log(error);
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

  async createNewEblaghie(req, res) {
    try {
      const { accessLevel , partition } = req.user;
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
         console.log({ 
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
           })

    //   const values = {
    //     controlCode: controlCode,
    //     controlName: controlName,
    //     partition: partition,
    //   };
    //   const conditions = {
    //     controlCode,
    //   };

    //   const [controler, created] = await this.Controles.findOrCreate({
    //     where: conditions,
    //     defaults: values,
    //   });
    //   console.log("created is : ", created);
    //   created
    //     ? this.response({
    //         res,
    //         message: "new controller created!",
    //         data: controler,
    //       })
    //     : this.response({
    //         res,
    //         message: "this control Code exist!",
    //         data: controler,
    //       });
    // } catch (error) {
    //   console.log(error.message);
     }
  }

  async editControls(req, res) {
    try {
      const { id, controlsCode, controlsName } = req.body;
      const result = await this.Mission.findOne({ where: { id } });

      if (result === null)
        this.response({
          res,
          message: "sorry! this row isnt exist!",
          data: result,
        });
      else {
        const query = `update controls set controlCode=${controlsCode} , controlName=${controlsName} , partition= where id =${id}`;
        await sequelize
          .query(query)
          .then((item) =>
            this.response({ res, message: "ok", data: controlsCode })
          )
          .catch((error) => console.log(error.message));
      }
    } catch (error) {
      console.log(error.message);
    }
  }
})();
