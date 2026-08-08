/********************************************************************************
 * [新增/修改功能]: 环境变量初始化 (Environment Config Initialization)
 * [修改原因]: 在程序最早期加载 .env 文件，使得数据库及密钥配置可全局读取
 ********************************************************************************/
require('dotenv').config();
/********************************************************************************/

const express = require("express");
const { query, param, body, validationResult } = require("express-validator");
const app = express();
const port = process.env.PORT || 3000;

/********************************************************************************
 * [新增/修改功能]: 企业级中间件 (Security & Performance Middlewares)
 * [修改原因]: 
 *  1. helmet: 设置 HTTP 安全标头防止 XSS、点击劫持等漏洞
 *  2. compression: 开启 Gzip 压缩，减少网络传输负载 60%+
 *  3. express-rate-limit: 全局 API 防刷限流，防护 DDoS 攻击
 ********************************************************************************/
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

app.use(helmet());
app.use(compression());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟时间窗口
  max: 200, // 每个 IP 限制最多 200 次请求
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes." }
});

app.use(apiLimiter);
/********************************************************************************/

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

/********************************************************************************
 * [新增/修改功能]: 引入 Redis 客户端模块 (Redis Memory Cache Import)
 * [修改原因]: 验证 Redis 初始建立连接状态
 ********************************************************************************/
const { isRedisAvailable } = require("./connections/redis");
/********************************************************************************/

app.use(express.json());

app.get('/', function (req, res) {
  res.status(200).json({
    message: 'GoodBuck system home page!',
    status: 'Running',
    redisConnected: isRedisAvailable()
  });
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