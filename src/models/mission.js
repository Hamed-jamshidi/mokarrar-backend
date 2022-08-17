const {Model ,DataTypes, INTEGER, STRING, DATE} =require("sequelize");
const sequelize = require("../../startup/db");


class Mission  extends Model{};
Mission.init({
 
  missionCode: { type: DataTypes.INTEGER, required: true, index:true },
  missionName: { type: DataTypes.INTEGER, required: true },
  partition: { type: DataTypes.NUMBER, default: 0 }
 

},{
  sequelize , 
  modelName:"mission",
  timestamps:true,
  },
);

module.exports = Mission