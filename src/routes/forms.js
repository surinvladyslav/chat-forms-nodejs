const { Router } = require('express');
const { formsControllers } = require('../controllers');

const router = Router();

router.route('/')
    .get(formsControllers.getForms)
    .post(formsControllers.addForms);
router.route('/:id').get(formsControllers.getFormsById);

module.exports = router;
