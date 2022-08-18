const controller = require("../controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { orderBy, first, result, isObject } = require("lodash");

const { Op } = require("@sequelize/core");
const { Sequelize, literal, where } = require("sequelize");
const { search } = require(".");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../../startup/db");
module.exports = new (class extends controller {
 
  async getAllMatrials(req, res) {
    try {
      const { partition } = req.user;
      const query = `select * from materials where partition=${partition}`;
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

  async createNewMaterial(req, res) {
    console.log("createNewControls");
    try {
      const { partition } = req.user;
      const { materialCode, materialName } = req.body;
      this.response({res , message:"jsld", data:{"first":req.body , "secound":req.user.partition}})
      const [material, created] = this.Material.findOrCreate({
        where: { materialCode },
        defaults: {
          materialCode,
          materialName,
          partition
        },
      });
      console.log('created is : ' , created)
      // created
      //   ? this.response({
      //       res,
      //       message: "new controller created!",
      //       data: material,
      //     })
      //   : this.response({ res, message: "this controlCode exist!", data: result });
    } catch (error) {
      console.log(error.message); 
    }
  }

  async editControls(req, res) {
    try {
      const { id, controlsCode, controlsName } = req.body;
      const query = `update controls set CorntrolCode=${controlsCode} , ControlName=${controlsName} where id =${id}`;
      await sequelize
        .query(query)
        .then((item) =>
          this.response({ res, message: "ok", data: controlsCode })
        )
        .catch((error) => console.log(error.message));
    } catch (error) {
      console.log(error.message);
    }
  }
})();
