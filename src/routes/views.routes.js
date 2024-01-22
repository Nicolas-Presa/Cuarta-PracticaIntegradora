import { Router } from "express";
import { ProductManager } from "../productManager.js";

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


export default router