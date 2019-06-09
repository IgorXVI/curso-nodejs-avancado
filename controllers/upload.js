const fs = require("fs")

module.exports = (app) => {
    app.post("/upload/image", (req, res)=>{
        const arquivo = req.headers.filename
        logger.info(`arquivo recebido: ${arquivo}`)
        
        req.pipe(fs.createWriteStream(`files/${arquivo}`))
        .on("finish", () => {
            logger.info(`arquivo escrito em "files/${arquivo}"`)
            res.status(201).send("OK")
        })

    })
}