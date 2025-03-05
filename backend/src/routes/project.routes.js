const {Router} = require('express');
const { create, List, reviewCode } = require('../controller/project.controller');


const routes = Router();


routes.post('/create', create);
routes.get('/list' ,List)
routes.post('/review' , reviewCode);

module.exports = routes