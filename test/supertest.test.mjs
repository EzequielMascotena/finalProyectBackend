import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const requester = supertest('http://localhost:8080');

before(async () => {
    await mongoose.connect('mongodb+srv://ezequielmascotena:ez123456@coderproject.gsslbll.mongodb.net/ecommerceTestingDB');
});

describe('Testing App', () => {

    //PRODUCTOS ******** 
    describe('Testing Products Router Apis', () => {
        let cookie;

        before(async function () {
            try {
                // Autenticarse, obtener la cookie de sesión y guardarla
                const loginRes = await requester
                    .post('/api/auth/login')
                    .send({ email: 'adminCoder@coder.com', password: 'adminCod3r123' });

                if (loginRes.status === 302 && loginRes.headers['set-cookie']) {
                    cookie = loginRes.headers['set-cookie'];
                } else {
                    throw new Error('No se recibió una cookie de sesión');
                }
            } catch (error) {
                throw new Error('Fallo al autenticar y obtener la cookie de sesión');
            }
        });

        before(async function () {  //aca no me funciono el .drop()
            // antes eliminamos el producto que vamos a crear despues
            try {
                await mongoose.connection.db.collection('products').deleteOne({ code: 'abc6' });
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        });


        it("Crear Producto: El API POST /api/products debe crear un producto nuevo correctamente", async () => {
            //Given
            const productMock = {
                "title": "producto prueba 6",
                "description": "este es un producto prueba",
                "price": 2006,
                "thumbnail": [],
                "code": "abc6",
                "stock": 6,
                "category": "camperas"
            }
            //Then
            const result = await requester.post('/api/products').set('Cookie', cookie).send(productMock)

            //Assert
            expect(result.status).is.equal(201);
            expect(result.body.data).is.ok.and.to.have.property('code');
        })


        it("obtener todos los Productos: El API Get /api/products debe obtener todos los productos", async () => {
            //Then
            const result = await requester.get('/api/products')

            //Assert
            expect(result.status).is.equal(200);
            expect(result.text).includes('html') //porque reenderiza en HBS
        })

        it("obtener producto por ID: El API Get /api/products/:id debe obtener el producto por id", async () => {
            //Given
            const productId = '6667d1480d213341f1b61980'
            //Then
            const result = await requester.get(`/api/products/${productId}`)

            //Assert
            expect(result.status).is.equal(200);
            expect(result.body).to.be.an('object').and.to.have.property('data');
            expect(result.body.data._id).to.equal('6667d1480d213341f1b61980');
        })

        it("modificar Producto: El API PUT /api/products/:pid debe modificar un producto correctamente", async () => {
            //Given
            const productMock = {
                "title": "producto prueba 2",
                "description": "este es un producto prueba modificado",
                "price": 2002,
                "thumbnail": [],
                "code": "abc2",
                "stock": 12,
                "category": "shoes"
            }
            //Then
            const result = await requester.put('/api/products/6667d1850d213341f1b61985').set('Cookie', cookie).send(productMock)
            //Assert
            expect(result.status).is.equal(200);
            expect(result.body).to.be.an('object');
            expect(result.body.response.msg).to.equal('Producto modificado correctamente');
            expect(result.body.response).to.have.property('data');
            expect(result.body.response.data._id).to.equal('6667d1850d213341f1b61985');
        })

        it("eliminar Producto: El API DELETE /api/products/:pid debe eliminar un producto correctamente", async () => {
            // Given
            const productMock = {
                "title": "Producto para eliminar",
                "description": "Este es un producto que será eliminado",
                "price": 100,
                "thumbnail": [],
                "code": "abc123",
                "stock": 10,
                "category": "shoes"
            };
            const createdProduct = await mongoose.connection.collection('products').insertOne(productMock);
            const productId = createdProduct.insertedId;

            // Then
            const result = await requester.delete(`/api/products/${productId}`).set('Cookie', cookie);
            // Assert
            expect(result.status).is.equal(200);
            expect(result.text).to.equal(`El producto con el id ${productId} se eliminó correctamente.`);
            expect(result.body).to.be.empty;
        })
    })



    //CARRITO  ***************************
    describe('Testing CARTS Router Apis', () => {
        let cookie;
        let createdCartId;

        before(async function () {
            try {
                // Autenticarse, obtener la cookie de sesión y guardarla
                const loginRes = await requester
                    .post('/api/auth/login')
                    .send({ email: 'aaaa@gmail.com', password: '1234' });

                if (loginRes.status === 302 && loginRes.headers['set-cookie']) {
                    cookie = loginRes.headers['set-cookie'];
                } else {
                    throw new Error('No se recibió una cookie de sesión');
                }
            } catch (error) {
                throw new Error('Fallo al autenticar y obtener la cookie de sesión');
            }
        })

        it("Crear Carrito: El API POST /api/carts debe crear un carrito nuevo correctamente", async () => {
            //Given

            //Then
            const result = await requester.post('/api/carts')

            //Assert
            expect(result.status).is.equal(201);
            expect(result.body).to.exist;
            expect(result.body).to.be.a('string')

            createdCartId = result.body;
        })

        it("obtener carrito por ID: El API Get /api/carts/:id debe obtener el carrito por id", async () => {
            //Then
            const result = await requester.get(`/api/carts/${createdCartId}`).set('Cookie', cookie)

            //Assert
            expect(result.status).is.equal(200);
            expect(result.text).includes('html') //porque reenderiza en HBS
        })

        it("agregar producto al carrito: El API POST /api/carts/:cid/product/:pid debe agregar un producto al carrito", async () => {
            //Given
            const productId = '6667d1480d213341f1b61980'
            //Then
            const result = await requester.post(`/api/carts/${createdCartId}/product/${productId}`).set('Cookie', cookie)
            //Assert
            expect(result.status).is.equal(201);
            expect(result.text).to.equal(`Producto ${productId} agregado al carrito ${createdCartId} correctamente.`)
        })

        it("eliminar producto al carrito: El API DELETE /api/carts/:cid/product/:pid debe eliminar un producto al carrito", async () => {
            //Given
            const productId = '6667d1480d213341f1b61980'
            //Then
            const result = await requester.delete(`/api/carts/${createdCartId}/product/${productId}`).set('Cookie', cookie)
            //Assert
            expect(result.status).is.equal(201);
            expect(result.text).to.equal(`Producto ${productId} eliminado del carrito ${createdCartId} correctamente.`)
        })

        it("modificar carrito por ID: El API PUT /api/carts/:cid debe modificar el carrito por id", async () => {
            //Given
            const updatedCart = [
                {
                    "product": "6667d1480d213341f1b61980",
                    "quantity": 2,
                    "_id": "66693974b96e0dd9f2c1a74b"
                }
            ];

            // Then
            const result = await requester.put(`/api/carts/${createdCartId}`).set('Cookie', cookie).send(updatedCart);

            //Assert
            expect(result.status).is.equal(200);
            expect(result.body.msg).to.equal('Carrito modificado correctamente');
            expect(result.body).to.have.property('data').to.be.an('object');
            expect(result.body.data).to.have.property('products').to.be.an('array')
        })

        it("modificar la cantidad: El API PUT /api/carts/:cid/product/:pid debe modificar la cantidad de un producto en el carrito", async () => {
            //Given
            const pid = "6667d1480d213341f1b61980"
            const updatedQty = {
                "quantity": 6
            }

            // Then
            const result = await requester.put(`/api/carts/${createdCartId}/product/${pid}`).set('Cookie', cookie).send(updatedQty);

            //Assert
            expect(result.status).is.equal(200);
            expect(result.body.msg).to.equal('Cantidad modificada correctamente');
            expect(result.body).to.have.property('data').that.is.an('object');
            expect(result.body.data.product).to.equal(pid);
            expect(result.body.data.quantity).to.equal(updatedQty.quantity);
        })

        it("eliminar todos los productos del carrito: El API DELETE /api/carts/:cid debe eliminar todos los productos del carrito correctamente", async () => {
            // When
            const result = await requester.delete(`/api/carts/${createdCartId}`).set('Cookie', cookie);

            // Assert
            expect(result.status).is.equal(200);
            expect(result.text).to.equal(`Todos los productos fueron eliminados del carrito ${createdCartId} correctamente.`);
            expect(result.body).to.be.empty
        })

        after(async function () {
            // Eliminar el carrito de la base de datos
            try {
                await mongoose.connection.db.collection('carts').deleteOne({ _id: new mongoose.Types.ObjectId(createdCartId) });
            } catch (error) {
                console.error('Error al eliminar el carrito de Testing:', error);
            }
        });
    })


    //Session *************************
    describe('Testing Sessions Router Apis', () => {
        let cookie;

        before(async function () {
            try {
                // Autenticarse, obtener la cookie de sesión y guardarla
                const loginRes = await requester
                    .post('/api/auth/login')
                    .send({ email: 'aaaa1@gmail.com', password: '1234' });

                if (loginRes.status === 302 && loginRes.headers['set-cookie']) {
                    cookie = loginRes.headers['set-cookie'];
                } else {
                    throw new Error('No se recibió una cookie de sesión');
                }
            } catch (error) {
                throw new Error('Fallo al autenticar y obtener la cookie de sesión');
            }
        })


        it("Current User: El API Get /api/users/current debe obtener el usuario actualmente logueado", async () => {
            //Given
            //Then
            const result = await requester.get('/api/users/current').set('Cookie', cookie);


            //Assert
            expect(result.status).is.equal(200)
            expect(result.text).includes('html') //porque reenderiza en HBS
        })

        it("Current User: El API Get /api/users/current debe obtener el usuario actualmente logueado.", async () => {
            //Given
            //Then
            const result = await requester.get('/api/users/current').set('Cookie', cookie);


            //Assert
            expect(result.status).is.equal(200)
            expect(result.text).includes('html') //porque reenderiza en HBS
        })

        it("Premium a user: El API Get /api/users/premium/:uid debe modificar el role del usuario actualmente en premium a user.", async () => {
            //Given
            const userId= '6669356c471529c99eb44d1d'
            //Then
            const result = await requester.get(`/api/users/premium/${userId}`).set('Cookie', cookie);
    
            // Asserts
            expect(result.status).to.equal(200);
            expect(result.body.msg).to.equal("Rol del usuario actualizado correctamente.");
            expect(result.body.newRole).to.equal('user');
        });
    
        it("user a Premium: El API Get /api/users/premium/:uid debe modificar el role del usuario actualmente en user a premium.", async () => {
            //Given
            const userId= '6669356c471529c99eb44d1d'
            //Then
            const result = await requester.get(`/api/users/premium/${userId}`).set('Cookie', cookie);
    
            // Asserts
            expect(result.status).to.equal(200);
            expect(result.body.msg).to.equal("Rol del usuario actualizado correctamente.");
            expect(result.body.newRole).to.equal("premium")
        });
    })
})

