const express = require('express');
const formController = require('../controllers/index');

const router = express.Router();

router.get('/:id', formController.findOne);
router.post('/:id', formController.submit).post('/', formController.create);

module.exports = router;
