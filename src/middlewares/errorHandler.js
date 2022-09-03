const pgError = require('pg-error');
const httpStatus = require('http-status');
const AppError = require("../utils/appError");

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (error instanceof AppError) {
        const statusCode =
            error.statusCode || error instanceof pgError ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new AppError(statusCode, message);
    }
    next(error);
};

const errorException = (err, req, res, next) => {
    let { statusCode, message } = err;

    if(err instanceof AppError) {
        return res.status(statusCode).json({
            statusCode,
            message,
            time: new Date()
        })
    }
    res.status(500).json({
        statusCode: 500,
        message,
        time: new Date()
    })

    return next()
}

module.exports = {
    errorConverter,
    errorException,
};