const projectModel = require("../models/project.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");


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

 module.exports.reviewCode = async(req, res) =>{
   const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"  , systemInstruction:'reviewCode' });

// const prompt = "Explain how AI works";

 const {code} = req.body;
const result = await model.generateContent(code);
 const resposne  = result.response.text()
return res.json(resposne);
 }