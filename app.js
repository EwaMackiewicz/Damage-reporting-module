const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const damageReportsRoutes = require("./api/routes/damageReports");
const decisionsRoutes = require("./api/routes/decisions");
const clientInsurancesRoutes = require("./api/routes/clientInsurances");

mongoose.connect('mongodb://admin:admin123@io-projekt-shard-00-00-y4jss.mongodb.net:27017,io-projekt-shard-00-01-y4jss.mongodb.net:27017,io-projekt-shard-00-02-y4jss.mongodb.net:27017/test?ssl=true&replicaSet=IO-projekt-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

app.use("/damageReports", damageReportsRoutes);
app.use("/decisions", decisionsRoutes);
app.use("/clientInsurances", clientInsurancesRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;  