const cryptoController = require('../controllers/cryptocurrency')

module.exports = (app,router) => {
    router.post("/add-data",cryptoController.add);
    router.get("/balance",cryptoController.list);

    app.use("/api",router)
}