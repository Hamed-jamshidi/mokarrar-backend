const { Model, DataTypes } = require('sequelize')
const sequelize = require('../../startup/db')
// const Credit = require('./credit')

class User extends Model {}
User.init(
  {
    firstname: { type: DataTypes.STRING, required: true, index: true },
    lastname: { type: DataTypes.STRING, required: true },
    username: { type: DataTypes.STRING, required: true },   
    password: { type: DataTypes.STRING, required: true },
    accessLevel: { type: DataTypes.NUMBER, default: 4 }, //admin = 1 , modir = 2 , qc = 3 , operator = 4
    partition: { type: DataTypes.NUMBER, default: 0 },// acrylic = 1 , epoxy = 2 , recycle =3 , polyurtan = 4, shimiaee = 5
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: true,
  },
)
 
module.exports = User
