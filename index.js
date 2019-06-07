const app = require("./config/custom-express")

const pagamentosController = require("./controllers/pagamentos")
pagamentosController(app)

let porta = 6663
app.listen(porta, ()=>{
    console.log(`ouvindo na porta ${porta}`)
})