const ConnectionFactory = require("../persistencia/Factory/ConnectionFactory")
const PagamentoDAO = require("../persistencia/DAO/PagamentoDAO")

module.exports = (app) => {
    app.get("/pagamentos", (req, res) => {
        res.send("ok")
    })

    app.post("/pagamentos/pagamento", (req, res) => {
        const pagamento = req.body

        console.log("processando pagamento...")

        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty()
        req.assert("valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3, 3);

        const errors = req.validationErrors();
        if (errors) {
            console.log("Erros de validação encontrados");
            res.status(400).send(errors);
            return;
        }

        pagamento.status = "CRIADO";
        pagamento.data = new Date;

        const connection = ConnectionFactory.create()
        const pagamentoDAO = new PagamentoDAO(connection)

        pagamentoDAO.salva(pagamento, (erro, result) => {
            if (erro) {
                res.status(500).send(erro);
                return;
            }

            console.log('pagamento criado: ' + result);
            res.location('/pagamentos/pagamento/' + result.insertId);
            pagamento.id = result.insertId;

            res.status(201).json(pagamento);
        })
    })

    app.put("/pagamentos/pagamento/:id", (req, res) => {
        const pagamento = {};
        const id = req.params.id;

        console.log("processando pagamento...")

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        const connection = ConnectionFactory.create()
        const pagamentoDAO = new PagamentoDAO(connection)

        pagamentoDAO.atualiza(pagamento, (erro) => {
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            console.log('pagamento criado');
            res.send(pagamento);
        })
    })

    app.delete('/pagamentos/pagamento/:id', function (req, res) {
        const pagamento = {}
        const id = req.params.id

        console.log("processando pagamento...")

        pagamento.id = id
        pagamento.status = 'CANCELADO'

        const connection = ConnectionFactory.create()
        const pagamentoDAO = new PagamentoDAO(connection)

        pagamentoDAO.atualiza(pagamento, (erro) => {
            if (erro) {
                res.status(500).send(erro)
                return;
            }
            console.log('pagamento cancelado')
            res.status(204).send(pagamento)
        });
    });


}