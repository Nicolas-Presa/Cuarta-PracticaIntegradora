import { Router } from "express";
import messageModel from '../dao/models/message.model.js';
import {ProductManager} from '../dao/daoMongo/productManager.controller.mdb.js'
import {CartManager} from '../dao/daoMongo/cartManager.controller.mdb.js'

const router = Router();
const productController = new ProductManager();
const cartController = new CartManager();

router.get('/', async (req, res) => {
    try {
        let filter = req.query.filter;
        let limit = parseInt(req.query.limit, 10) || 10;
        let page = parseInt(req.query.page, 10) || 1;
        let sort = req.query.sort;

        const products = await productController.getProducts(filter, limit, page, sort);
        products.pages = [];
        for (let i = 1; i <= products.totalPages; i++) {
            products.pages.push(i);
        }

        res.render('products', {
            title: 'Productos',
            products: products
        });
    } catch (err) {
        res.status(400).send({ status: 'error', payload: err.message });
    }
});


router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        let cart = await cartController.getCartsById(cartId);

        res.render('cart', {
            title: 'Tu Carrito de compras',
            cart: cart
        });
    } catch (err) {
        res.status(400).send({status: 'error', payload: err.message});
    }
});

router.get('/chat', async(req, res) => {
    res.render('chat', )
})

router.post('/save-message', async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = new messageModel({ user, message });
        await newMessage.save();
        res.status(200).send({status: 'Success', payload: 'Mensaje guardado'});
    } catch (error) {
        res.status(500).send({status: 'error', payload: 'Error al guardar el mensaje'});
    }
});


// router.get('/', async(req, res) => {
//     try{
//         const products = await controller.getProducts()
//         console.log(products)
//         res.render('home', {
//             title: 'Lista de Productos',
//             products: products
//         })
//     }catch{
//         res.status(500).send('Error del servidor al intentar mostrar los productos')
//     }
// })


// router.get('/realtimeproducts', async(req, res) => {
//     try{
//         const products = await manager1.getProducts()
//         res.render('realTimeProducts', {
//             title: 'Lista de Productos',
//             products: products
//         })
//     }catch{
//         res.status(500).send('Error del servidor al intentar mostrar los productos')
//     }
// })




export default router