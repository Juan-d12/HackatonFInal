const express = require('express');
const cookieSession = require('cookie-session');
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());    // Middlewares de express
app.use(express.urlencoded({ extended: true }));    // Middlewares de express

app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_SECRET],  // should use a secret env variable
  httpOnly: true,
}));

app.get('/', (req, res) => {
  res.send('Hackaton Final Diego');
});

// Endpoints
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// Conectar a la base de datos
const sequelize = require('./app/models/index');
const User = require('./app/models/user.model');
const Role = require('./app/models/role.model');
const Product = require('./app/models/product.model');
const Cart = require('./app/models/cart.model');
const Compra = require('./app/models/compra.model');

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

// Inicializar las tablas
Role.sync().then(() => {
  console.log('Roles table created or found successfully!');
  inicializarRoles();
}).catch((error) => {
  console.error('Unable to create Roles table : ', error);
});

User.sync().then(() => {
  console.log('Users table created or found successfully!');
}).catch((error) => {
  console.error('Unable to create Users table : ', error);
});

Product.sync().then(() => {
  console.log('Products table created or found successfully!');
}).catch((error) => {
  console.error('Unable to create Products table : ', error);
});

Cart.sync().then(() => {
  console.log('Carts table created or found successfully!');
}).catch((error) => {
  console.error('Unable to create Carts table : ', error);
});

Compra.sync().then(() => {
  console.log('Compras table created or found successfully!');
}).catch((error) => {
  console.error('Unable to create Compras table : ', error);
});


// Funcion para inicializar los Roles
async function inicializarRoles() {
  // admin role
  await Role.findOrCreate({
    where: { role: "admin"},
    defaults: { role: "admin"},
  }).then(function(){
    console.log("admin role created");
  }).catch(err => {
    console.log("Error -> " + err);
  });
  // user role
  await Role.findOrCreate({
    where: { role: "user"},
    defaults: { role: "user"},
  }).then(function(){
    console.log("user role created");
  }).catch(err => {
    console.log("Error -> " + err);
  });
};


app.listen(PORT, () => {
  console.log(`server is running on on port ${PORT}`);
});
