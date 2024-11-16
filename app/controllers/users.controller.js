const User = require('../models/user.model');
const Role = require('../models/role.model');
const Product = require('../models/product.model');

// CRUD de los usuarios
// Encontrar todos los usuarios
exports.findAllUsers = async(req, res) => {
    const usuarios = await User.findAll();
    return res.send(usuarios);
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