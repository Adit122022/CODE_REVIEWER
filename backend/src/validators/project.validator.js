const { body } = require('express-validator');

module.exports = {
  createProject: [
    body('name')
      .trim()
      .notEmpty().withMessage('Project name is required')
      .isLength({ min: 3 }).withMessage('Project name must be at least 3 characters')
      .isLength({ max: 50 }).withMessage('Project name cannot exceed 50 characters'),
    body('code')
      .optional()
      .isString()
      .isLength({ max: 10000 }).withMessage('Code content is too large')
  ]
};