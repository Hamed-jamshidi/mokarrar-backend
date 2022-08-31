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

  async deleteMaterial(req, res) {
    try {
      const id = req.params.materialId;
      const query = `delete from materials where id=${id}`;
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

      const [material, created] = await this.Material.findOrCreate({
        where: { materialCode },
        defaults: {
          materialCode,
          materialName,
          partition,
        },
      });
      console.log("created is : ", created);
      created
        ? this.response({
            res,
            message: "new material created!",
            data: material,
          })
        : this.response({ res, message: "this material exist!",success:false, data:material });
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateMaterial(req, res) {
    try {
      const { id, materialCode, materialName } = req.body;
      const result = await this.Material.findOne({ where: { id } });

      if (result === null)
        this.response({
          res,
          message: "sorry! this row isnt exist!",
          success:false,
          data: result,
        });
      else {
        const query = `UPDATE materials
                       SET materialName = ${materialName} , materialCode = ${materialCode} 
                       WHERE id = ${id}`;
        await sequelize
          .query(query)
          .then((rows) =>
            this.response({ res, message: "ok", data: materialCode })
          )
          .catch((error) => console.log(error.message));
      }
    } catch (error) {  
      console.log(error.message);
    }
  }
})();
