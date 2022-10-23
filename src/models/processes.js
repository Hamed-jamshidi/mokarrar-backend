const {Model ,DataTypes, INTEGER, STRING, DATE} =require("sequelize");
const sequelize = require("../../startup/db");


class Processes  extends Model{};
Processes.init({

  batchNumber: { type: DataTypes.INTEGER, required: true, index:true },  
  actionName: {type: DataTypes.STRING, required: true},
  controllerName: {type: DataTypes.STRING, required: true},
  operatorName: {type: DataTypes.STRING, required: true},
  stationName: {type: DataTypes.STRING, required: true},
  acceptValue: {type: DataTypes.STRING, required: true},
  result: {type: DataTypes.BOOLEAN }, // this field fill jsut with qc 
  materialName: {type: DataTypes.BOOLEAN, required: true},
  measuredValue: {type: DataTypes.FLOAT},// operators
  identifyCode: {type: DataTypes.STRING}, //operators
  startTime: {type: DataTypes.TIME},//operators
  endTime: {type: DataTypes.TIME},//operators
  
 

},{
  sequelize , 
  modelName:"processes",
  timestamps:true,
  },
);

module.exports = Processes