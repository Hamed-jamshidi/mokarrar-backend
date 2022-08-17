const express = require('express')
const app = express()
const sequelize = require('./startup/db')
const debug = require('debug')('app:main')
const config = require('config')
const winston = require('winston')
const User = require('./src/models/user')
// const Credit = require('./src/models/credit')
// const License = require('./src/models/license')
const { urlencoded } = require('express')
const router = require('./src/routes');
const cors = require("cors");

require('./startup/config')(app, express)
// Credit.belongsTo(User);
// License.belongsTo(User);
// User.hasMany(Credit);
// User.hasMany(License);



sequelize.sync().then(() => {
  console.log('database is ready!')   
})

require('./startup/logging')()

// const p = Promise.reject(new Error("something failed outside promise"));
// p.then(()=>console.log("done"));
app.use(cors());
app.use('/api', router)

const port = 3008 
app.listen(port, () => console.log(`listining on port ${port}`))


