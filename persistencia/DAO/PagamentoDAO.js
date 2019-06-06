module.exports = class PagamentoDAO {
    constructor(connection){
        this._connection = connection
    }

    salva(pagamento, callback){
        this._connection.query("INSERT INTO pagamentos SET ?", pagamento, callback)
    }

    atualiza(pagamento,callback) {
        this._connection.query('UPDATE pagamentos SET status=?  WHERE id=?', [pagamento.status, pagamento.id], callback);
    }

    lista(callback){
        this._connection.query("SELECT * FROM pagamentos", callback)
    }

    buscaPorID(id, callback){
        this._connection.query("SELECT * FROM pagamentos WHERE id=?", [id], callback);
    }

}