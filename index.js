const app = require("./config/custom-express")

const userController = require("./controllers/user")
userController(app)

const pagamentosController = require("./controllers/pagamentos")
pagamentosController(app)

const uploadController = require("./controllers/upload")
uploadController(app)

let porta = 6663
app.listen(porta, ()=>{
    console.log(`ouvindo na porta ${porta}`)
})