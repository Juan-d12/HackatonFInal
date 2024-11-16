const authJwt = require('../middlewares/authJwt.middleware');
const controlador = require('../controllers/users.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    // All access routes
    app.get("/api/Home", controlador.listarProductos);

    // Any User routes (requires only login)

    // Only Admin routes
    app.get(
        "/api/Users", 
        [authJwt.verifyToken, authJwt.isAdmin], 
        controlador.findAllUsers
    );

    app.get("/api/Roles", 
        [authJwt.verifyToken, authJwt.isAdmin], 
        controlador.findAllRoles
    );

    app.post("/api/Producto", 
        [authJwt.verifyToken, authJwt.isAdmin], 
        controlador.crearProducto
    );
};