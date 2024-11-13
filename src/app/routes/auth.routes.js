module.exports = app => {
    let router = require("express").Router();
    const controlador = require('../controllers/auth.controller');

    router.post("/", controlador.crearUsuario);
    router.get("/", controlador.findAllUsers);
    router.post("/login", controlador.login);
    // router.get("/:name", users.findOne);
    // router.put("/:name", users.update);
    // router.delete("/:id", users.delete);
    // router.delete("/", users.deleteAll);

    app.use('/api/users', router);
}