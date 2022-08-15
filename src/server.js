const express = require('express');
const cors = require('cors');
const {Sequelize} = require('sequelize');
const httpStatus = require('http-status');

const {env} = require('./config/settings');
const db = require('./database/models');
const config = require(`${__dirname}/./config/config.js`)[env];

const {errorException, errorConverter} = require('./middlewares/errorHandler');

const AppError = require('./utils/appError');

const apiRouter = require('./routes/api');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

// db.sequelize.sync();

// drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and re-sync db.');
});

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize
    .sync()
    .then(() => {
      console.log(`DB connection sucessful.`);
    })
    .catch((err) => {
      console.log(`Unable to connect to the database', error: ${err.message}.`);
    });

app.use((req, res, next) => {
  next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorException);
app.use(errorConverter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = app;
