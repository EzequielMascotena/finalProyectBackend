import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';


const requester = supertest('http://localhost:8080')

mongoose.connect('mongodb+srv://ezequielmascotena:ez123456@coderproject.gsslbll.mongodb.net/ecommerceTestingDB')

describe('Testing App', () => {

    describe('Testing Products Router Apis', () => {
        
        beforeEach(async function () {
            mongoose.connection.collections.products.drop()
            //this.timeout(5000); // tiempo de espera a la BD
        })


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
            const result = await requester.post('/api/products').send(productMock)

            //Assert
            expect(result.status).is.equal(201);
            expect(result.body.data).is.ok.and.to.have.property('code');
        })



    })


})