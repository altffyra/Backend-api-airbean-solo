const express = require('express');
const menuRoute = express.Router();
const {authApi, authenticate} = require('../modules/apikeys')
const {menuResult, duplicationCheck, addProduct, deleteProduct} = require('../modules/nedb')


// /api/menu	GET	Returnerar en kaffemeny
menuRoute.get('/', async (request, response)=> {
    const menuResults = await menuResult();
    const resObj = {menu: menuResults};
    response.json(resObj);
    })
    
// FRONTEND : BODY:{"id":8,"title":"Skaffe Latte","desc":"Bryggd på månadens bönor.","price":54}
//            HEADER: apiKeyAuth: KEY

menuRoute.post('/', authenticate, async (request, response)=> {
    const newProduct = request.body
    const resObj = {}
    if (newProduct.hasOwnProperty('id') 
    && newProduct.hasOwnProperty('title') && 
    newProduct.hasOwnProperty('desc') &&
    newProduct.hasOwnProperty('price')) {
        const result = await duplicationCheck(request.body)
        if (result.length == 0 ){
            const resultAdd = await addProduct(request.body)
            if (resultAdd) { resObj.message ="added!"; resObj.object = newProduct }
        } else resObj.message = 'item "id" or "title" already occupied'
    } else resObj.message ="invalid product, product needs 'id', 'title', 'desc' and 'price'";
    response.json(resObj)
    })

// FRONTEND : BODY:{"id":8,"title":"Skaffe Latte","desc":"Bryggd på månadens bönor.","price":54}
//            HEADER: apiKeyAuth: KEY

    menuRoute.delete('/', authenticate, async (request, response)=> {
        const oldProduct = request.body
        const resObj = {}
        if (oldProduct.hasOwnProperty('id') 
        && oldProduct.hasOwnProperty('title') && 
        oldProduct.hasOwnProperty('desc') &&
        oldProduct.hasOwnProperty('price')) {
            const result = await deleteProduct(request.body)
            if (result >= 1 ){
                resObj.object = oldProduct
                resObj.message = "deleted!"
            } else { resObj.message =  "item title not found"
        }
        } else resObj.message ="invalid product, product needs 'id', 'title', 'desc' and 'price'";
        response.json(resObj);    
    })

    module.exports = menuRoute