const { Router } = require('express');
const { formsControllers } = require('../../controllers/api');

const router = Router();

router.route('/').get(formsControllers.getForms).post(formsControllers.addForms);
// router.route('/:id').get(postControllers.getPostsById);
// router.route('/:slug').get(postControllers.getPostsBySlug);

module.exports = router;
