
# Ecommerce Backend
En este proyecto desarrollo el Backend de un Ecommerce, implementando Node.js, Express, Handlebars, socket.io, MongoDb como base de datos, express-session conectado tambien con mongo...

por el momento tenemos toda la logica de un CRUD de productos, carrito y login+usuarios.


DEPENDENCIAS:
- connect-mongo : "5.1.0",
- express: "4.18.2",
- express-handlebars "7.1.2"
- express-session: "1.18.0"
- mongoose: "8.1.1"
- mongoose-paginate-v2: "1.8.0"
- multer: "1.4.5-lts.1"
- nodemon: "3.0.2"
- socket.io: "4.7.4"
- uuid4: "2.0.3"


## Installation

Install my-project with npm

- GIT CLONE
- NPM I
- NPM START (para ejecutar el server)
- NPM RUN PROD (para ejecutar el servidor en modo production)
- NPM RUN DEV (para ejecutar el servidor en modo development)

#ENDPOINTS
INICIO de app / con LOGIN:  http://localhost:8080

registro: http://localhost:8080/api/register

perfil: http://localhost:8080/api/profile

todos los productos: http://localhost:8080/api/products

productos con filtros y limite: http://localhost:8080/api/products?limit=6&page=1&sort=desc


otras herramientas:
productos en tiempo real: http://localhost:8080/api/tools/realTimeProducts

chat: http://localhost:8080/api/tools/chat

## Authors

- [EzequielMascotena]


## 🔗 Links
(https://github.com/EzequielMascotena)