const nedb =  require('nedb-promise')
const keyDatabase = new nedb({filename: 'keysDatabase.db', autoload:true})

async function authenticate(request, response, next) {
    const apiKeyAuth = request.headers.apikeyauth
    const result = await authApi(apiKeyAuth)
    if (result.length > 0) {
        next()
    } else {
        response.json("Access denied!")
    }
}

async function authApi(key){
const result = await keyDatabase.find({key: key});
return result
}
     

module.exports = {authApi, authenticate}