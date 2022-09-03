const express = require('express');
const formsRoutes = require('./forms');

const router = express.Router();

router.use('/forms', formsRoutes);

module.exports = router;
