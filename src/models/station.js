const {Model ,DataTypes, INTEGER, STRING, DATE} =require("sequelize");
const sequelize = require("../../startup/db");


class Station  extends Model{};
Station.init({
 
  stationCode: { type: DataTypes.INTEGER, required: true, index:true },
  partition: { type: DataTypes.NUMBER, default: 0 },
  stationName: { type: DataTypes.INTEGER, required: true },
 

},{
  sequelize , 
  modelName:"station",
  timestamps:true,
  },
);

module.exports = Station