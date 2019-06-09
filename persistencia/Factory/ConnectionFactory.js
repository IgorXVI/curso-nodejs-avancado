const mysql = require("mysql")

module.exports = class ConnectionFactory {
    static create() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'igor2',
            password: '',
            database: 'curso-nodejs-avancado'
        });
    }
}
