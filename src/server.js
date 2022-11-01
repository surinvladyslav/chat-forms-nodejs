require('dotenv').config()
const express = require('express');
const httpStatus = require('http-status');
const createError = require('http-errors');
const cors = require('cors');
const db = require('./database/models');

const AppError = require('./utils/appError');
const {errorConverter, errorException} = require("./middlewares/errorHandler");

const apiRouter = require('./routes');
const bodyParser = require("express");

const app = express();

app.use(cors());
app.options('*', cors());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-    With,content-type,Accept,content-type,application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS,     PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const urlencodedParser = bodyParser.urlencoded({
  extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(db.url);

db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log('successfully connected to the database');
}).catch(err => {
    console.log('error connecting to the database');
    console.log(err);
    process.exit();
});

app.use('/api/forms', apiRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use((req, res, next) => {
    next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorException);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
