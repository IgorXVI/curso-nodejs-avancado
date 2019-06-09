const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const morgan = require("morgan")
const logger = require("../persistencia/logger")

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.use(expressValidator())

app.use(morgan("common", {
    stream: {
        write: function (message) {
            logger.info(message)
        }
    }
}))

module.exports = app