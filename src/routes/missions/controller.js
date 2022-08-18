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
  async sayHello(req, res) {
    this.response({ res, message: "hello!", data: { message: "hello" } });
    console.log("hello firest api");
  }

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
    console.log("createNewControls");
    try {
      const { partition } = req.user;
      const { controlCode, controlName } = req.body;
      const [controler, created] = this.Controles.findOrCreate({
        where: { ControlCode: controlCode },
        defaults: {
          ControlCode: controlCode,
          controlName: controlName,
          partition: partition,
        },
      });
      created
        ? this.response({
            res,
            message: "new controller created!",
            data: controler,
          })
        : this.response({ res, message: "this controlCode ex!", data: result });
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
