const express = require('express');
const menuRoute = express.Router();
const {authApi, authenticate} = require('../modules/apikeys')
const {menuResult} = require('../modules/nedb')


// /api/menu	GET	Returnerar en kaffemeny
menuRoute.get('/', async (request, response)=> {
    const menuResults = await menuResult();
    const resObj = {menu: menuResults};
    response.json(resObj);
    })
    

menuRoute.post('/', authenticate, async (request, response)=> {
    const newProduct = request.body
    const resObj = {}
    if (newProduct.hasOwnProperty('id') 
    && newProduct.hasOwnProperty('title') && 
    newProduct.hasOwnProperty('desc') &&
    newProduct.hasOwnProperty('price')) {
        response.json('added!')

    }else response.json("invalid product, product needs 'id', 'title', 'desc' and 'price'")
    // const menuResults = await menuResult();
    // const resObj = {menu: menuResults};
    // response.json(resObj);
    })

    module.exports = menuRoute