const {Router} = require('express');
const { create, List } = require('../controller/project.controller');


const routes = Router();


routes.post('/create', create);
routes.get('/list' ,List)

module.exports = routes