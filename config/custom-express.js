const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.use(expressValidator())

module.exports = app