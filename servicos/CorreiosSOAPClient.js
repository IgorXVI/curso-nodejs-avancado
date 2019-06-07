const soap = require("soap")

module.exports = class CorreiosSOAPClient {
    constructor(url){
        this._url = url
    }

    calculaPrazo(args, callback){
        soap.createClient(this._url, (err, client)=>{
            client.calculaPrazo(args, callback)
        })
    }

}