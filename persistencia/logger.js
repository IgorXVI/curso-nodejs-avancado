const winston = require("winston")
const fs = require('fs');

if(!fs.existsSync("logs")){
    fs.mkdirSync("logs")
}

const logger = new winston.Logger({
    transports:[
        new winston.transports.File({
            level: "info",
            filename: "logs/payfast.log",
            maxsize: 1048576,
            maxFiles: 10,
            colorize: false
        })
    ]
})

module.exports = logger