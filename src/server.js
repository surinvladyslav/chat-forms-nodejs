require('dotenv').config()
const express = require('express');
const httpStatus = require('http-status');
const createError = require('http-errors');
const cors = require('cors');
const db = require('./database/models');

const AppError = require('./utils/appError');
const {errorConverter, errorException} = require("./middlewares/errorHandler");

const apiRouter = require('./routes');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/forms', apiRouter);

console.log(db.url);

app.get((req, res) => {
  res.json('hello world');
})

db.mongoose.connect(db.url, {
    useNewUrlParser: true,
}).then(() => {
    console.log('successfully connected to the database');
}).catch(err => {
    console.log('error connecting to the database');
    console.log(err);
    process.exit();
});

app.use(function (req, res, next) {
    next(createError(404));
});

app.use((req, res, next) => {
    next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorException);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}.`))

module.exports = app;
