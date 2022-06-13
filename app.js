const express = require('express');
const app = express();
const {menuResult, checkAccount, createAccount, loginAccount, createOrder, findOrders} = require('./modules/nedb')
const PORT = 8000
app.use(express.json())



// /api/order	POST	Sparar en kaffebeställning för en användare och returnerar en ETA-tid och ordernummer 
// (båda dessa kan slumpas) till frontend. Om ett användarnamn skickas med i beställningen ska ordern kopplas till 
// detta användarnamn i databasen. Ifall inget användarnamn skickas med så ska beställningen sparas som gäst.

// UTFORMNING AV FRONTEND REQUEST {"username": "", "password": "", "cart": {[ {ITEM}, {ITEM} ]}

app.post('/api/order', async (request, response)=> {
    const credentials = request.body
    if (credentials.hasOwnProperty('cart')){
        const resObj = {}
        if (credentials.hasOwnProperty('username')) {
                const result = await checkAccount(credentials)
                if (result.length > 0) {
                    const orderResults = await createOrder(credentials);
                   resObj.order= orderResults
                   addPrices(orderResults)
                   resObj.order.ordernumber= orderResults._id
                } else {
                    resObj.message = "Account does not exist!"
                }
            response.json(resObj)
        } else {
            credentials.username = "guest";
            const orderResults = await createOrder(credentials);
            addPrices(orderResults)
            resObj.order= orderResults
            resObj.order.ordernumber= orderResults._id
            response.json(resObj)
        }
    }
})
function addPrices(orderResults){
    orderResults.totalPrice= 0
    const orderResultsOrder = orderResults.order
    for (let i = 0; i < orderResultsOrder.length; i++) {
        const singleItem = orderResultsOrder[i];
        orderResults.totalPrice = parseInt( orderResults.totalPrice + singleItem.price) ;
    }
}


// /api/order/:id	GET	Returnerar orderhistorik för en specifik användare
// skicka med en jämförelse i returneringen om en är klar
app.get('/api/order/:id', async (request, response)=> {

        const username = request.params.id;
        const findOrder = await findOrders(username)
        for (let i = 0; i < findOrder.length; i++) {
            const singleOrder = findOrder[i];
            checkIfDone(singleOrder);
        }
        response.json(findOrder);
})

function checkIfDone(singleOrder) {
    const rightNow = new Date().toLocaleString()
    singleOrder.totalPrice = 0;
    if (singleOrder.ETA > rightNow ) {
     singleOrder.done = "done";
    }
    const singleOrderCart = singleOrder.order;
     for (let i = 0; i < singleOrderCart.length; i++) {
         const singleItem = singleOrderCart[i];
         singleOrder.totalPrice = parseInt( singleOrder.totalPrice + singleItem.price) ;
    }
}



// /api/menu	GET	Returnerar en kaffemeny
app.get('/api/menu', async (request, response)=> {
    const menuResults = await menuResult();
    const resObj = {menu: menuResults};
    response.json(resObj);
    })
    


// /api/account/signup	POST	Skapar ett användarkonto

//   UTFORMNING AV SIGNUP FRONTEND  {"email" : "", "username": "", "password": ""}
app.post('/api/account/signup', async (request, response)=> {
    const credentials = request.body
    const resObj = {};
    if (credentials.hasOwnProperty('email') && credentials.hasOwnProperty('username') && credentials.hasOwnProperty('password')) {
        const result = await checkAccount(credentials);
        if (result.length < 1) {
            const result = createAccount(credentials)
            resObj.message = "success";
            resObj.account = result;
        } else {
            resObj.message = "Account already exists";
        }
    } else {
        resObj.message = "No valid credentials " ;
    }
    response.json(resObj);
})


// /api/account/login	POST	Logga in

//   UTFORMNING AV LOGIN FRONTEND  {"username": "", "password": ""}


app.post('/api/account/login', async (request, response)=> {
    const credentials = request.body;
    const resObj = {};
    if (credentials.hasOwnProperty('username') && credentials.hasOwnProperty('password')) {
        const result = await loginAccount(credentials);
        if (result.length > 0) {
            resObj.message = "Account successfully logged in!";
        } else  resObj.message = "Wrong username/password";
    } else {
        resObj.message = "No credentials BIFOGAT";
    }
    response.json(resObj);
})


app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
    console.log("Listening to orders");
})
