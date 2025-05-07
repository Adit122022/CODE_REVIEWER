const express = require('express');
const router = express.Router();
const projectController = require('../controller/project.controller');
const projectValidator = require('../validators/project.validator');

router.post('/create', projectValidator.createProject, projectController.create);
router.get('/list', projectController.list);
router.post('/review', projectController.reviewCode);

module.exports = router;