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


  async getAllStations(req, res) {
    try {
      const { partition } = req.user;
      const query = `select * from stations where partition=${partition}`;
      const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      this.response({ res, message: "ok", data: result });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteStations (req, res) {
    try {
      const id = req.params.stationId;
      const query = `delete from stations where id=${id}`;
      const result = await sequelize.query(query, { type: QueryTypes.DELETE });
      this.response({ res, message: "row deleted!", data: result });
    } catch (error) {
      console.log(error);
    }
  }

  async createNewStation(req, res) {
    console.log("create New stations");

    try {
      const { partition } = req.user;
      const { stationCode, stationName } = req.body;
      const [station, created] = await  this.Station.findOrCreate({
        where: { stationCode },
        defaults: {
         stationCode,
         stationName,
         partition,
        },
      });
      created
        ? this.response({
            res,
            message: "new station created!",
            data: station,
          })
        : this.response({ res, message: "this station exists!", data: station });
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateStation(req, res) {
    try {
      const { id, stationCode, stationName } = req.body;
      const query = `update stations set stationCode=${stationCode} , stationName=${stationName} where id =${id}`;
      const result = await this.Mission.findOne({where:{id}})
  
      if (result === null ) this.response({res , message:"sorry! this row isnt exist!",data:result})
      else{
        await sequelize
        .query(query)
        .then(() =>
          this.response({ res, message: "ok", data: stationCode })
        )
        .catch((error)=>console.log(error.message));
      }
    
    } catch (error) {
      console.log(error.message);
    }
  }
})();
