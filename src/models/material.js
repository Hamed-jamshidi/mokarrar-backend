const {Model ,DataTypes, INTEGER, STRING, DATE} =require("sequelize");
const sequelize = require("../../startup/db");


class Material  extends Model{};
Material.init({
 
  materialCode: { type: DataTypes.INTEGER, required: true, index:true },
  materialName: { type: DataTypes.INTEGER, required: true },
  partition: { type: DataTypes.NUMBER, default: 0 }

},{
  sequelize , 
  modelName:"material",
  timestamps:true,
  },
);

module.exports = Material