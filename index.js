var express = require('express')
const app = express()
const sequelize = require('./startup/db')
const debug = require('debug')('app:main')
const config = require('config')
// const User = require('./src/models/user')

const { createProxyMiddleware } = require('http-proxy-middleware');
const Processes = require('./src/models/processes')
const Products = require('./src/models/products')
// const License = require('./src/models/license')
const { urlencoded } = require('express')
const router = require('./src/routes');
const cors = require("cors");

require('./startup/config')(app, express)
Processes.belongsTo(Products);
// License.belongsTo(User);
// User.hasMany(Credit);
// User.hasMany(License);



sequelize.sync().then(() => {
  console.log('database is ready!')   
})

require('./startup/logging')()

// const p = Promise.reject(new Error("something failed outside promise"));
// p.then(()=>console.log("done"));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cors({
  Origin: "*",
  methods:["POST","PUT","GET"],
}));
app.use('/api', router)

const port = 3008 
app.listen(port, () => console.log(`listining on port ${port}`))


