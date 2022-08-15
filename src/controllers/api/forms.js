// const httpStatus = require('http-status');
const { formsService } = require('../../services');
const catchError = require("../../utils/catchError");
const AppError = require("../../utils/appError");

const getForms = catchError(async (req, res) => {
    // throw new AppError(httpStatus.NOT_FOUND, 'id tag tidak ditemukan');

    res.status(200).json('ra');
});

const addForms = catchError(async (req, res) => {
    res.status(200).json('bomba');
});

// const getPostsById = catchError(async (req, res) => {
// });

// const getPostsBySlug = async (req, res) => {
// }

module.exports = {
    getForms,
    addForms,
    // getPostsById,
    // getPostsBySlug,
};
