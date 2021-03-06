const ConnectionFactory = require("../persistencia/ConnectionFactory")
const PagamentoDAO = require("../persistencia/PagamentoDAO")
const logger = require("../persistencia/logger")

const CartoesClient = require("../servicos/CartoesClient")
const MemcachedClient = require("../servicos/MemcachedClient")

module.exports = (app) => {

    app.get("/pagamentos", (req, res) => {
        res.send("ok")
    })

    app.get("/pagamentos/pagamento/:id", (req, res) => {
        if(!req.isloggedin){
            res.status(400).send("é necessario estar logado")
            return
        }

        const id = req.params.id

        logger.info(`procurando pagamento com id = ${id}`)

        const cache = MemcachedClient()
        cache.get('pagamento-' + id, function(erro, retorno) {
            if (erro || !retorno) {
                logger.info('MISS - chave nao encontrada');

                const connection = ConnectionFactory.create()
                const pagamentoDAO = new PagamentoDAO(connection)

                pagamentoDAO.buscaPorID(id, (erro, resultado) => {
                    if (erro) {
                        logger.info("Erro ao consultar o banco.")
                        res.status(500).send(erro)
                        return
                    }

                    logger.info("Pagamento encontrado.")
                    res.status(200).json(resultado)
                })
            } else {
                //HIT no cache
                logger.info('HIT - valor: ' + JSON.stringify(retorno));
                res.status(200).json(retorno)
            }
        });

    })

    app.post("/pagamentos/pagamento", (req, res) => {
        const pagamento = req.body["pagamento"]

        logger.info("processando pagamento...")

        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty()
        req.assert("pagamento.valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
        req.assert("pagamento.moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3, 3);

        const errors = req.validationErrors();
        if (errors) {
            logger.info("Erros de do pagamento validação encontrados.");
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

            pagamento.id = result.insertId;

            if (pagamento.forma_de_pagamento == "cartao") {
                const cartao = req.body["cartao"]

                logger.info("processando cartao...")

                req.assert("cartao.numero", "Número é obrigatório e deve ter 16 caracteres.").notEmpty().len(16, 16);
                req.assert("cartao.bandeira", "Bandeira do cartão é obrigatória.").notEmpty();
                req.assert("cartao.ano_de_expiracao", "Ano de expiração é obrigatório e deve ter 4 caracteres.").notEmpty().len(4, 4);
                req.assert("cartao.mes_de_expiracao", "Mês de expiração é obrigatório e deve ter 2 caracteres").notEmpty().len(2, 2);
                req.assert("cartao.cvv", "CVV é obrigatório e deve ter 3 caracteres").notEmpty().len(3, 3);

                const errors = req.validationErrors();

                if (errors) {
                    logger.info("Erros de validação do cartão encontrados.");

                    res.status(400).send(errors);
                    return;
                }

                const cartoesClient = new CartoesClient()
                cartoesClient.autoriza(cartao, (err, request, response, retorno) => {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    }
                    res.location('/pagamentos/pagamento/' + pagamento.id);

                    response = {
                        dados_do_pagamanto: pagamento,
                        cartao: retorno,
                        links: [{
                                href: "http://localhost:6663/pagamentos/pagamento/" + pagamento.id,
                                rel: "confirmar",
                                method: "PUT"
                            },
                            {
                                href: "http://localhost:6663/pagamentos/pagamento/" + pagamento.id,
                                rel: "cancelar",
                                method: "DELETE"
                            }
                        ]
                    }

                    res.status(201).json(response);
                })
            } else {
                res.location('/pagamentos/pagamento/' + pagamento.id);

                const response = {
                    dados_do_pagamento: pagamento,
                    links: [{
                            href: "http://localhost:6663/pagamentos/pagamento/" + pagamento.id,
                            rel: "confirmar",
                            method: "PUT"
                        },
                        {
                            href: "http://localhost:6663/pagamentos/pagamento/" + pagamento.id,
                            rel: "cancelar",
                            method: "DELETE"
                        }
                    ]
                }

                res.status(201).json(response);
            }

            const cache = MemcachedClient()
            cache.set('pagamento-' + pagamento.id, result, 100000, function (err) {
                logger.info('nova chave: pagamento-' + pagamento.id)
            });

        })

    })

    app.put("/pagamentos/pagamento/:id", (req, res) => {
        const pagamento = {};
        const id = req.params.id;

        logger.info("processando pagamento...")

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        const connection = ConnectionFactory.create()
        const pagamentoDAO = new PagamentoDAO(connection)

        pagamentoDAO.atualiza(pagamento, (erro) => {
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            logger.info('pagamento criado');
            res.status(202).json(pagamento)
        })
    })

    app.delete('/pagamentos/pagamento/:id', function (req, res) {
        const pagamento = {}
        const id = req.params.id

        logger.info("processando pagamento...")

        pagamento.id = id
        pagamento.status = 'CANCELADO'

        const connection = ConnectionFactory.create()
        const pagamentoDAO = new PagamentoDAO(connection)

        pagamentoDAO.atualiza(pagamento, (erro) => {
            if (erro) {
                res.status(500).send(erro)
                return;
            }
            logger.info('pagamento cancelado')
            res.status(204)
        });
    });

}