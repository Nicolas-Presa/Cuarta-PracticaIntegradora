import mongoose from "mongoose";
import supertest from "supertest";
import { expect } from "chai";

const requester = supertest('http://localhost:8080');
const connection = mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
const testProduct = {
    title: 'Producto de prueba',
    description: 'Este producto es parte de un test',
    code: '050',
    price: 1000,
    stock: 50,
    category: 'test',
    thumbnails: '/',
    owner: 'test@supertes.com'
};

describe('Testing de Products', function () {
    it('POST /api/products deber crear un nuevo producto correctamente', async function() {
        const result = await requester.post('/api/products').send(testProduct)
        const body = result._body

        expect(body.payload).to.haveOwnProperty('_id');
        expect(body.payload).to.haveOwnProperty('status').to.be.equal(true)

        testProduct._id = body.payload._id
    })

    it('PUT /api/products/pid debe actualizar un producto especifico correctamente', async function () {
        const newTitle = {title: 'producto de prueba PUT', role: 'admin'}
        const result = await requester.put(`/api/products/${testProduct._id}`).send(newTitle)
        const result2 = await requester.get(`/api/products/${testProduct._id}`);
        const payload = result2._body.payload

        expect(payload.title).to.be.equal(newTitle.title)
    })

    it('DELETE /api/products/pid debe eliminar un producto especifico correctamente', async function () {
        const product = await requester.delete(`/api/products/${testProduct._id}`)
        const result = product._body

        expect(result.payload).to.exist
    })
});