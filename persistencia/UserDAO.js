module.exports = class UserDAO {
    constructor(connection) {
        this._connection = connection
    }

    getData(email) {
        return new Promise((resolve, reject) => {
            this._connection.query("SELECT password, name FROM users WHERE email=?",
                [email],
                (error, results) => {
                    if (error) {
                        reject(new Error(error))
                        return
                    }

                    resolve(results)
                })
        })
    }
}