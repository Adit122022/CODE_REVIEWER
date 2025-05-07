const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Project name is required"],
    trim: true,
    minlength: [3, "Project name must be at least 3 characters"],
    maxlength: [50, "Project name cannot exceed 50 characters"]
  },
  code: { 
    type: String, 
    default: '',
    maxlength: [10000, "Code content is too large"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add text index for search functionality
projectSchema.index({ name: 'text', code: 'text' });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;