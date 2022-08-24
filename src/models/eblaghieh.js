const {Model ,DataTypes, INTEGER, STRING, DATE} =require("sequelize");
const sequelize = require("../../startup/db");


class Eblaghie  extends Model{};
Eblaghie.init({
  // manager can define a new rows and fill all of the filed except result and operators can loggin 
  // and  filed measured available and  finally qc complete result and descided that close the eblaghie
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
  result: {type: DataTypes.BOOLEAN }, // this field fill jsut with qc 
  materialName: {type: DataTypes.BOOLEAN, required: true},
  measuredValue: {type: DataTypes.FLOAT},// operators
  identifyCode: {type: DataTypes.STRING}, //operators
  startTime: {type: DataTypes.TIME},//operators
  endTime: {type: DataTypes.TIME},//operators
  close :{type:DataTypes.BOOLEAN }//qc
 

},{
  sequelize , 
  modelName:"eblaghie",
  timestamps:true,
  },
);

module.exports = Eblaghie