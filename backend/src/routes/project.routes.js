const {Router} = require('express');
const { create } = require('../controller/project.controller');


const routes = Router();


routes.post('/create', create);
// router.get('/list' ,)

module.exports = routes