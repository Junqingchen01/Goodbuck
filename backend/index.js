const express = require("express");
const { query, param, body, validationResult } = require("express-validator");
const app = express();
const port = process.env.PORT || 3000;

const swaggerUi = require('swagger-ui-express');
const swagerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
      openapi: '3.0.0',
      info: {
          title: 'Client API',
          version: '1.0.0',
      }
  },
  apis: ['./routes/*.js']
}

const specs = swagerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//import routes
const dashboard = require('./routes/dashboardRouter');
const despesas = require('./routes/despesasRouter');
const dica = require('./routes/dicaRouter');
const metas = require('./routes/metasRouter');
const notifications = require('./routes/notificationsRouter');
const perfil = require('./routes/perfilRouter');

const mysqlConn = require("./connections/mysql").sequelize;
app.use(express.json());

app.get('/', function (req, res) {
  res.status(200).json({message:'GoodBuck system home page!'});
});


//rotes
// DASHBOARD
app.use('/dashboard',dashboard);

//DESPESAS
app.use('/despesas',despesas);

//DICA
app.use('/dica',dica);

//META
app.use('/metas',metas);

//NOTIFICATIONS
app.use('/notifications',notifications);

//PERFILL OU LOGIN
app.use('/perfil', perfil);
app.use('/login', perfil);


app.listen(port, () => {
    console.log("App is running on port " + port);
  
    mysqlConn
      .authenticate()
      .then(() => {
        console.log("Connected to mysql database");
      })
      .catch((err) => {
        console.log("Error connecting to the database");
      });
  });
  
  module.exports = app;