module.exports = app => {
    let router = require("express").Router();
    const controlador = require('../controllers/auth.controller');

    // User related routes
    // router.get("/Users", controlador.findAllUsers);          done
    router.post("/Registro", controlador.crearUsuario);
    router.post("/Login", controlador.login);
    router.post("/Logout", controlador.logout);
    // router.get("/Roles", controlador.findAllRoles);          done

    // Product related routes
    // router.get("/Home", controlador.listarProductos);        done
    // router.post("/Producto", controlador.crearProducto);     done

    // router.get("/:name", users.findOne);
    // router.put("/:name", users.update);
    // router.delete("/:id", users.delete);
    // router.delete("/", users.deleteAll);

    app.use('/api', router);
}