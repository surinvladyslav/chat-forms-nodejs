const pgError = require('pg-error');
const httpStatus = require('http-status');
const AppError = require('../utils/appError');

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof AppError)) {
        const statusCode =
            error.statusCode || error instanceof pgError ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new AppError(statusCode, message, false, err.stack);
    }
    next(error);
};

const errorException = (err, req, res, next) => {
    let { statusCode, message } = err;
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];

    const response = {
        code: statusCode,
        message,
    };

    res.status(statusCode).send(response);
};

module.exports = {
    errorConverter,
    errorException,
};
