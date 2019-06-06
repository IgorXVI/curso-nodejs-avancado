const mysql = require("mysql")

module.exports = class ConnectionFactory {
    static create() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'curso-nodejs-avancado'
        });
    }
}