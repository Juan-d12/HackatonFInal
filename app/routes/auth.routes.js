module.exports = app => {
    let router = require("express").Router();
    const controlador = require('../controllers/auth.controller');

    router.post("/Registro", controlador.crearUsuario);
    router.post("/Login", controlador.login);
    router.post("/Logout", controlador.logout);

    // router.get("/:name", users.findOne);
    // router.put("/:name", users.update);
    // router.delete("/:id", users.delete);
    // router.delete("/", users.deleteAll);

    app.use('/api', router);
}