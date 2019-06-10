const UserDAO = require("../persistencia/UserDAO")
const ConnectionFactory = require("../persistencia/ConnectionFactory")

module.exports = (app) => {
    app.post("/auth", (req, res) => {
        req.assert("email", "email deve ser informado").notEmpty()
        req.assert("email", "email invalido").isEmail()

        req.assert("password", "password deve ser infromado").notEmpty()
        req.assert("password", "password deve ter ao menos 8 caracteres").isLength({
            min: 8
        })

        const validationErrors = req.validationErrors()
        if (validationErrors) {
            res.status(400).json(validationErrors)
            return
        }

        const email = req.body.email
        const password = req.body.password

        const connection = ConnectionFactory.create()
        const userDAO = new UserDAO(connection)

        userDAO.getData(email)
            .then(
                (rowData) => {
                    if (rowData.length == 0) {
                        res.status(400).send(`nao foi possivel achar os dados do usuario com email ${email}`)
                        return
                    }

                    const data = rowData[0]
                    if (password != data.password) {
                        res.status(400).send("senha incorreta")
                        return
                    }

                    req.session.loggedin = true
                    req.session.username = data.name
                    res.status(200).send(`bem vindo ${data.name}`)
                }
            )
            .catch(
                (error) => {
                    console.log(`erro na validacao do usuario:\n ${error}`)
                    res.status(500).send("erro no servidor")
                }
            )

    })
}