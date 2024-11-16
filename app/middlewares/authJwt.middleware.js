const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');

// Verificar que se ha logeado (se tiene un token)
exports.verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(401).send({ message: "No token provided" })
    };

    jwt.verify(token, 
        process.env.SECRET_KEY_JWT, 
        (err, decoded) => {
            if (err) {
                return res.status(403).send({ message: "Unauthorized!" })
            };
            req.userId = decoded.id;
            next();
      });
};

// Verificar que es admin
exports.isAdmin = async (req, res, next) => {
    if (!req.userId) {
        return res.status(500).send({ message: "Login not detected" })
    };

    // Encontrar usuario
    const usuario =  await User.findOne({ where: {id: req.userId} });

    if (!usuario) {
        return res.status(500).send({ message: "Failed to authenticate user" });
    };
    // Determinar si es admin
    const currentRole = await Role.findOne({ where: {id: usuario.RoleId } });
    const adminRole = await Role.findOne({ where: {role: "admin"} });

    if (currentRole.id === adminRole.id) {
        next();
        return;
    };

    return res.status(403).send({ message: "Requires Admin Role" });
};