import { Router } from "express";
// import { ProductManager } from "../controllers/productManager.controller.fs.js";
import { ProductManager } from '../dao/daoMongo/productManager.controller.mdb.js'

const router = Router();
const controller = new ProductManager();
// const manager1 = new ProductManager('./products.json');
// const products = await manager1.getProducts();



router.get('/', async (req, res) => {
    try{
        const products = await controller.getProducts()
        res.status(200).send({status: 'OK', data: products})
    }catch(err){
        res.status(400).send({status: 'ERR', data: err.message});
    }
    
})

router.get('/:pid', async(req, res) => {
    let productPid = req.params.pid;
    let product = await controller.getProductById(productPid);

    if(!product){
        return res.status(400).send( {error: 'Producto no encontrado'} );
    }else{
        return res.status(200).send({status: 'OK', data: product});
    }
})

router.post('/', async (req, res) => {
    try{
        const { title, description, code, price, status, stock, category, thumbnails } = req.body
        
        if(!title || !description || !code || !price || !status || !stock || !category || !thumbnails){
            res.status(400).send({status: 'ERR', data: 'Faltan completar campos'})
        }else{
            const newContent = { title, description, code, price, status, stock, category, thumbnails}
            const result = await controller.addProduct(newContent)
            res.status(200).send({status: 'OK', data: result})
        }
    }catch(err){
        res.status(500).send({status: 'ERR', data: err.message})
    }
})

router.put('/:pid', async (req, res) => {
    try {
        let updateProduct = req.body;
        let productPid = req.params.pid;
        await controller.updateProduct(productPid, updateProduct);

        const newProduct = await controller.getProductById(productPid);

        if(!newProduct){
            res.status(500).send('Error al actualizar el producto')
        }else{
            res.status(200).send({status: 'OK', data: newProduct});
        }

    } catch{
        res.status(500).send('Error interno al actualizar el producto');
    }
});


router.delete('/:pid', async (req, res) => {
    const productPid = req.params.pid;
    await controller.deleteProduct(productPid);

    if(!productPid){
        res.status(400).send('producto no encontrado')
    }else{
        res.status(200).send(`Producto eliminado correctamente`);
    }
})

export default router