module.exports = app => {
    let router = require("express").Router();
    const controlador = require('../controllers/auth.controller');

    router.get("/", controlador.findAllUsers);
    router.post("/", controlador.crearUsuario);
    router.post("/login", controlador.login);
    router.post("/logout", controlador.logout);
    router.get("/roles", controlador.findAllRoles);
    // router.get("/:name", users.findOne);
    // router.put("/:name", users.update);
    // router.delete("/:id", users.delete);
    // router.delete("/", users.deleteAll);

    app.use('/api/users', router);
}