var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require('../models/user.model');
const Role = require('../models/role.model');

// Login
exports.login = async(req, res) => {
    // Validar body
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message:"Email y Password no pueden estar vacíos"
        });
    };

    const usuario = await User.findOne({ 
        where: { 
            email: req.body.email,
        },
    });

    if (!usuario) {
        return res.status(404).json({
            message:"User not found"
        });
    };

    // Validar password
    const isValid = bcrypt.compareSync(req.body.password, usuario.password);
    if (!isValid) {
        return res.status(401).json({
            message:"Invalid Password"
        });
    };

    // Generar token
    const token = jwt.sign({ id: usuario.id, username: usuario.username, email: usuario.email },
        process.env.SECRET_KEY_JWT,
        {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: '1h' // expira en 1 hora
        });

    // Valores a retornar
    publicUser = {
        username: usuario.username,
        email: usuario.email,
        token: token
    }
    return res.status(200).send(publicUser);
};

// CRUD
// Crear nuevo usuario
exports.crearUsuario = async(req, res) => {
    // Validar que existe el body
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(401).json({
            message:"Debe especificar username, email y password"
        });
    };

    // Validar email
    const existUser = await User.findOne({ where: { email: req.body.email } });

    if(existUser){
        return res.status(400).json({
            message:"Email ya está en uso"
        });
    };

    const nuevoUsuario = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),   // hashed password
    };

    User.create(nuevoUsuario).then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the User."
        });
    });
};

// Encontrar todos los usuarios
exports.findAllUsers = async(req, res) => {
    const usuarios = await User.findAll();
    return res.send(usuarios);
};
