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


  async getAllControls(req, res) {
    try {
      const { partition } = req.user;
      const query = `select * from controls where partition=${partition}`;
      const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      this.response({ res, message: "ok", data: result });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteControls(req, res) {
    try {
      const id = req.params.constrolsId;
      const query = `delete from controls where id=${id}`;
      const result = await sequelize.query(query, { type: QueryTypes.DELETE });
      this.response({ res, message: "row deleted!", data: result });
    } catch (error) {
      console.log(error);
    }
  }

  async createNewControl(req, res) {
   
    try {
      const { partition } = req.user;
      const { controlCode, controlName } = req.body;
     
      const values = {
        controlCode: controlCode,
        controlName: controlName,
        partition: partition
      };
      const conditions = {
        controlCode
      };
     
     
      const [controler, created] = await this.Controles.findOrCreate({
      where: conditions,
       defaults:values,
      });
      console.log("created is : ", created)
      created? this.response({
            res,
            message: "new controller created!",
            data: controler,
          }) : this.response({ res, message: "this control Code exist!", data:controler  });
    } catch (error) {
      console.log(error.message);
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
        else{
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
