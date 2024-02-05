import { Router } from "express";
import { ProductManager } from "../dao/daoFile/productManager.controller.fs.js";
import messageModel from '../dao/models/message.model.js.js';

const router = Router();
const manager1 = new ProductManager('./products.json');

router.get('/', async(req, res) => {
    try{
        const products = await manager1.getProducts()
        res.render('home', {
            title: 'Lista de Productos',
            products: products
        })
    }catch{
        res.status(500).send('Error del servidor al intentar mostrar los productos')
    }
})


router.get('/realtimeproducts', async(req, res) => {
    try{
        const products = await manager1.getProducts()
        res.render('realTimeProducts', {
            title: 'Lista de Productos',
            products: products
        })
    }catch{
        res.status(500).send('Error del servidor al intentar mostrar los productos')
    }
})

router.get('/chat', async(req, res) => {
    res.render('chat', )
})

router.post('/save-message', async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = new messageModel({ user, message });
        await newMessage.save();
        res.status(200).send('Mensaje guardado');
    } catch (error) {
        res.status(500).send('Error al guardar el mensaje');
    }
});


export default router