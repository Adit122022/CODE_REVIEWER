const projectModel = require("../models/project.model");

 module.exports.create = async(req,res) =>{
    const {name , code} = req.body;
    if(!name || !name?.trim())  return res.status(400).json({message:"Name is required"});
     const project = await projectModel.create({name:name , code:code});
     return res.status(201).json({
            message:"Project created successfully",
            data:project
     });
 }
 module.exports.List= async(req,res) =>{
    const projects = await projectModel.find();
    return res.json(projects);
 }