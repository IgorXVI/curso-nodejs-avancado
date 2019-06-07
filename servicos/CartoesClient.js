const restifyClients = require("restify-clients")

module.exports = class CartoesClient {
    constructor(){
        this._client = restifyClients.createJsonClient({
            url: 'http://localhost:3001',
            version: '~1.0'
        })
    }

    autoriza(cartao, callback){
        this._client.post("/cartoes/autoriza", cartao, callback)
    }
}