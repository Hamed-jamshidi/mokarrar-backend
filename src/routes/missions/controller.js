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

  async getAllMissions(req, res) {
    try {
      console.log("hello")
      const { partition } = req.user;
      const query = `select * from missions where partition=${partition}`;
      const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      this.response({ res, message: "ok", data: result });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteMissions(req, res) {
    try {
      const id = req.params.missionId;
      const query = `delete from missions where id=${id}`;
      const result = await sequelize.query(query, { type: QueryTypes.DELETE });
      this.response({ res, message: "row deleted!", data: result });
    } catch (error) {
      console.log(error);
    }
  }

  async createNewMission(req, res) {
    console.log("createNewMissions");
    try {
      const { partition } = req.user;
      const { missionCode, missionName } = req.body;
      const [missoin, created] = await this.Mission.findOrCreate({
        where: { missionCode },
        defaults: {
          missionCode,
          missionName,
          partition,
        },
      });

      created
        ? this.response({
            res,
            message: "new mission created!",
            data: missoin,
          })
        : this.response({ res, message: "this mission code exists!", data: missoin });
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateMission(req, res) {
    try {
      const { id, missionCode, missionName } = req.body;
      const result = await this.Mission.findOne({where:{id}})
  
    if (result === null ) this.response({res , message:"sorry! this row isnt exist!",data:result})
     else{
      const query = `update missions set missionCode=${missionCode} , missionName=${missionName} where id =${id}`;
      await sequelize
        .query(query)
        .then(() =>
          this.response({ res, message: "ok", data: missionCode })
        )
        .catch((error) => console.log(error.message));
     } 
 
 
    } catch (error) {
      console.log(error.message);
    }
  }
})();
