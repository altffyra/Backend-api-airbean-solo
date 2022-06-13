const express = require('express');
const app = express();
const PORT = 8000
app.use(express.json())
const accountRoute = require('./routes/account')
const menuRoute = require('./routes/menu')
const orderRoute = require('./routes/order')


app.use('/api/account/', accountRoute)
app.use('/api/menu', menuRoute)
app.use('/api/order', orderRoute)



app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
    console.log("Listening to orders");
})
