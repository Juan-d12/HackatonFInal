var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require('../models/user.model');
const Role = require('../models/role.model');
const Product = require('../models/product.model');

// Login
exports.login = async(req, res) => {
    // Validar body
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message:"Email y Password no pueden estar vacíos"
        });
    };

    const usuario = await User.findOne({ where: { email: req.body.email} });

    if (!usuario) {
        return res.status(404).json({
            message:"User not found"
        });
    };

    // Validar password
    const passwordIsValid = bcrypt.compareSync(req.body.password, usuario.password);
    if (!passwordIsValid) {
        return res.status(401).json({
            message:"Invalid Password"
        });
    };

    // Recuperar rol
    const userRole = await Role.findOne({ where: { id: usuario.RoleId} });

    // Generar token y guardarlo en la sesion
    const token = jwt.sign({ id: usuario.id },
        process.env.SECRET_KEY_JWT,
        {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: '24h' // expira en 24 horas
        });

    req.session.token = token;

    // Valores a retornar
    publicUser = {
        username: usuario.username,
        email: usuario.email,
        role: userRole.role
    }
    return res.status(200).send(publicUser);
};

// Logout
exports.logout = async(req, res) => {
    try {
        req.session = null;
        return res.status(200).json({
            message:"You have logged out!"
        });
    }
    catch (err) {
        this.next(err);
    };
};


// CRUD de los Usuarios
// Encontrar todos los usuarios
exports.findAllUsers = async(req, res) => {
    const usuarios = await User.findAll();
    return res.send(usuarios);
};

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

    if (existUser) {
        return res.status(400).json({
            message:"Email ya está en uso"
        });
    };

    let roleId;
    // Si no especifica determinar rol de usuario por defecto
    if (!req.body.RoleId) {
        const userRole = await Role.findOne({ where: { role: "user" } });
        roleId = userRole.id;
    }
    // Validar rol especificado
    else {
        const existRole = await Role.findOne({ where: { role: req.body.RoleId } });
        
        if (!existRole) {
            return res.status(400).json({
                message:"Rol no valido"
            });
        };

        roleId = existRole.id;
    };

    const nuevoUsuario = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),   // hashed password
        RoleId: roleId
    };

    User.create(nuevoUsuario).then(data => {
        return res.status(200).json({
            message:"User created successfully!"
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the User."
        });
    });
};


// CRUD de los Roles
// Encontrar todos los roles
exports.findAllRoles = async(req, res) => {
    const roles = await Role.findAll();
    return res.send(roles);
};


// CRUD de los productos
// Listar todos los productos en la tienda
exports.listarProductos = async(req, res) => {
    const productos = await Product.findAll();
    return res.send(productos);
};

// Crear nuevo producto
exports.crearProducto = async(req, res) => {
    // Validar que existe el body
    if (!req.body.title || !req.body.price || !req.body.category || !req.body.description || !req.body.image) {
        res.status(401).json({
            message:"Debe especificar title, price, category, description e image (url)"
        });
    };

    // Validar titulo
    const existProduct = await Product.findOne({ where: { title: req.body.title } });

    if (existProduct) {
        return res.status(400).json({
            message:"El producto ya se encuentra en el catálogo"
        });
    };

    const nuevoProducto = {
        title: req.body.title,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        image: req.body.image
    };

    Product.create(nuevoProducto).then(data => {
        return res.status(200).json({
            message:"Product added successfully!"
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Product."
        });
    });
};