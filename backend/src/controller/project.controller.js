const projectModel = require("../models/project.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { validationResult } = require('express-validator');

// Configure Gemini AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  systemInstruction: 'You are a code reviewer. Provide detailed feedback on code quality, performance, potential issues, and improvements. Format your response with clear sections.'
});

module.exports = {
  /**
   * Create a new project
   */
  create: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, code = '' } = req.body;
      
      const project = await projectModel.create({ 
        name: name.trim(),
        code
      });

      return res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project
      });

    } catch (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  },

  /**
   * List all projects
   */
  list: async (req, res) => {
    try {
      const projects = await projectModel.find().select('-__v').lean();
      
      return res.json({
        success: true,
        count: projects.length,
        data: projects
      });

    } catch (error) {
      console.error('Error listing projects:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  },

  /**
   * Review code using Gemini AI
   */
  reviewCode: async (req, res) => {
   try {
     console.log('Request body:', req.body); // Debug logging
     
     const { code } = req.body;
     
     if (!code || typeof code !== 'string') {
       return res.status(400).json({
         success: false,
         message: "Valid code content is required as a string"
       });
     }
 
     // Trim and check if code is empty after trimming
     const trimmedCode = code.trim();
     if (!trimmedCode) {
       return res.status(400).json({
         success: false,
         message: "Code content cannot be empty"
       });
     }
 
     const result = await model.generateContent(`
       Please review the following code:
       \n\n${trimmedCode}\n\n
       Provide feedback in this format:
       1. Code Quality (1-10)
       2. Performance Suggestions
       3. Potential Issues
       4. Best Practices Recommendations
       5. Documentation Suggestions
     `);
 
     const response = await result.response.text();
     
     return res.json({
       success: true,
       data: response
     });
 
   } catch (error) {
     console.error('Error reviewing code:', error);
     return res.status(500).json({
       success: false,
       message: "Failed to generate code review",
       error: error.message
     });
   }
 }
};