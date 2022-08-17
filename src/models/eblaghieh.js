const {Model ,DataTypes, INTEGER, STRING, DATE} =require("sequelize");
const sequelize = require("../../startup/db");


class Eblaghie  extends Model{};
Eblaghie.init({
  
  productName: { type: DataTypes.STRING, required: true },
  partition: { type: DataTypes.NUMBER, default: 0 },
  batchNumber: { type: DataTypes.INTEGER, required: true, index:true },
  batchValue: {type: DataTypes.STRING, required: true},
  customerName: {type: DataTypes.STRING, required: true},
  produtType: {type: DataTypes.STRING, required: true},
  startDate: {type: DataTypes.DATE, required: true},
  sayDate: {type: DataTypes.DATE, required: true},
  actionName: {type: DataTypes.STRING, required: true},
  controllerName: {type: DataTypes.STRING, required: true},
  operatorName: {type: DataTypes.STRING, required: true},
  stationName: {type: DataTypes.STRING, required: true},
  acceptValue: {type: DataTypes.STRING, required: true},
  result: {type: DataTypes.BOOLEAN, required: true},
  materialName: {type: DataTypes.BOOLEAN, required: true},
  measuredValue: {type: DataTypes.FLOAT, required: true},
  identifyCode: {type: DataTypes.STRING, required: true},
  startTime: {type: DataTypes.TIME, required: true},
  endTime: {type: DataTypes.TIME, required: true},
 

},{
  sequelize , 
  modelName:"eblaghie",
  timestamps:true,
  },
);

module.exports = Eblaghie