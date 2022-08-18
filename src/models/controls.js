
const {Model ,DataTypes} =require("sequelize");
const { syslog } = require("winston/lib/winston/config");
const sequelize = require("../../startup/db");


class Controls  extends Model{};
Controls.init({
  
  controlCode: { type: DataTypes.INTEGER, required: true ,index:true},
  controlName: { type: DataTypes.STRING, required: true },
  partition: { type: DataTypes.NUMBER, default: 0 }
 
  
},{
  sequelize , 
  modelName:"control",
  timestamps:true,
  
}
)
module.exports = Controls



