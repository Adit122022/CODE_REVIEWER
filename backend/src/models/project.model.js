const mongoose = require('mongoose');
const projectSchema  = new mongoose.Schema({
    name: { type: String, required: [true , "Project name is required"] },
   code :{ type :String , default:'' },
})

const projectModel = mongoose.model('Project', projectSchema);
module.exports = projectModel;