const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const morgan = require("morgan")
const session = require("express-session")
const passport = require("passport")
const cors = require("cors")

const logger = require("../persistencia/logger")


const app = express()

app.use(session({
    secret: 'passport-tutorial',
    cookie: {
        maxAge: 60000
    },
    resave: false,
    saveUninitialized: false
}))

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

app.use(passport.initialize())

app.use(cors())

module.exports = app