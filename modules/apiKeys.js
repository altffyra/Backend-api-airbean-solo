const nedb = require("nedb-promise");
const keyDatabase = new nedb({ filename: "keysDatabase.db", autoload: true });

async function authenticate(request, response, next) {
  const apiKeyAuth = request.headers.apikeyauth;
  const result = await authApi(apiKeyAuth);
  const resObj = {}
  if (result.length > 0) {
    next();
  } else {
    resObj.message = "Access denied!";
    response.json(resObj);
  }
}

async function authApi(key) {
  const result = await keyDatabase.find({ key: key });
  return result;
}

module.exports = { authApi, authenticate };
