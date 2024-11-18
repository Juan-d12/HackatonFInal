const User = require('../models/user.model');
const Role = require('../models/role.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Compra = require('../models/compra.model');

// CRUD de los usuarios
// Encontrar todos los usuarios (requieres admin)
exports.findAllUsers = async(req, res) => {
    const usuarios = await User.findAll();
    return res.send(usuarios);
};


// CRUD de los Roles
// Encontrar todos los roles (requieres admin)
exports.findAllRoles = async(req, res) => {
    const roles = await Role.findAll();
    return res.send(roles);
};


// CRUD de los productos
// Listar todos los productos en la tienda (all access)
exports.listarProductos = async(req, res) => {
    const productos = await Product.findAll();
    return res.send(productos);
};

// Crear nuevo producto (requires admin)
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


// CRUD del carrito de compras
// Listar todos los productos en el carrito (requires same user)
exports.listarCarrito = async (req, res) => {
    // Encontrar el carrito de compras del usuario que hace la peticion (req.userId)
    const carrito =  await Cart.findAll({ where: { UserId: req.userId } });
    return res.send(carrito);
};

// Añadir producto al carrito (requires same user)
exports.addToCart = async (req, res) => {
    // Validar que existe al body
    if (!req.body.productName) {
        res.status(401).json({
            message:"Debe especificar el nombre del producto (title)"
        });
    }

    let cantidad;
    // Si no especifica cantidad es 1 por defecto
    if (!req.body.quantity) {
        cantidad = 1;
    }
    else {
        cantidad = req.body.quantity;
    };

    // Validar titulo del producto
    const existProduct = await Product.findOne({ where: { title: req.body.productName } });

    if (!existProduct) {
        return res.status(400).json({
            message:"El producto ingresado no es valido"
        });
    };

    // Verificar si el produco ya se encontraba en el carrito
    const productInCart = await Cart.findOne({ where: { UserId: req.userId, ProductId: existProduct.id } });

    if (productInCart) {
        // Modificar entrada existente
        productInCart.quantity += cantidad;
        await productInCart.save();
        return res.send(productInCart);
    };

    // Crear nueva entrada
    const nuevoCarrito = {
        quantity: cantidad,
        UserId: req.userId,
        ProductId: existProduct.id,
    };
    
    Cart.create(nuevoCarrito).then(data => {
        return res.status(200).json({
            message:"Product added successfully to the Cart!"
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while adding the Product to the Cart."
        });
    });
};


// CRUD de las compras realizadas
// Listar todos los productos comprados (requires same user)
exports.listarCompras = async (req, res) => {
    // Encontrar las compras del usuario que hace la peticion (req.userId)
    const compras = await Compra.findAll({ where: { UserId: req.userId } });
    res.send(compras);
};

// Mover productos del carrito a la lista de productos comprados (requires same user)
exports.purchase = async (req, res) => {
    const currentCart = await Cart.findAll({ where: { UserId: req.userId } });
    const carrito = JSON.parse(JSON.stringify(currentCart));    // JSON truco
    // Dejar solo las columnas de quantity, UserId y ProductId
    let cart = [];
    for (let i = 0; i < carrito.lenght; i++) {
        cart[i] = {
            quantity: carrito[i]['quantity'],
            UserId: carrito[i]['UserId'],
            ProductId: carrito[i]['ProductId']
        };
    };

    // Añadir los productos del carrito de compras a la lista de productos comprados
    Compra.bulkCreate(cart).then(() => {
        // Vaciar el carrito de compras
        Cart.destroy({ where: { UserId: req.userId } });
    })
    .then(data => {
        return res.status(200).json({
            message:"Purchase successful!"
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while purchasing the products."
        });
    });
};
