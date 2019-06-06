const restify = require("restify")

module.exports = class CartoesClient {
    constructor(){
        this._client = restify.createJsonClient({
            url: 'http://localhost:3000',
            version: '~1.0'
        })
    }

    autoriza(cartao, callback){
        this._client.post("/cartoes/autoriza", cartao, callback)
    }
}