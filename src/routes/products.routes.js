import { Router } from "express";
import { ProductManager } from '../dao/daoMongo/productManager.controller.mdb.js'

const router = Router();
const controller = new ProductManager();




router.get('/', async (req, res) => {
    try{
        const { filter = 'pantalones', limit = '5', page = '2'} = req.query
        const products = await controller.getProducts(filter, limit, page)
        res.status(200).send({status: 'Success', payload: products})
    }catch(err){
        res.status(400).send({status: 'error', payload: err.message});
    }
    
})

router.get('/:pid([a-fA-F0-9]{24})', async(req, res) => {
    try{
        let productPid = req.params.pid;
        let product = await controller.getProductById(productPid);

        if(!product){
            return res.status(500).send( {error: 'Producto no encontrado'} );
        }else{
            return res.status(200).send({status: 'Success', payload: product});
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

router.post('/', async (req, res) => {
    try{
        const { title, description, code, price, status, stock, category, thumbnails } = req.body
        
        if(!title || !description || !code || !price || !status || !stock || !category || !thumbnails){
            res.status(400).send({status: 'error', data: 'Faltan completar campos'})
        }else{
            const newContent = { title, description, code, price, status, stock, category, thumbnails}
            const result = await controller.addProduct(newContent)
            res.status(200).send({status: 'Success', data: result})
        }
    }catch(err){
        res.status(500).send({status: 'error', data: err.message})
    }
})

router.put('/:pid([a-fA-F0-9]{24})', async (req, res) => {
    try {
        let updateProduct = req.body;
        let productPid = req.params.pid;
        await controller.updateProduct(productPid, updateProduct);

        const newProduct = await controller.getProductById(productPid);

        if(!newProduct){
            res.status(500).send({status: 'error', payload: 'Error al actualizar el producto'})
        }else{
            res.status(200).send({status: 'Success', data: newProduct});
        }

    } catch{
        res.status(500).send('Error interno al actualizar el producto');
    }
});


router.delete('/:pid([a-fA-F0-9]{24})', async (req, res) => {
    try{
        const productPid = req.params.pid;
        await controller.deleteProduct(productPid);

        if(!productPid){
            res.status(500).send({status: 'error', payload: 'producto no encontrado'})
        }else{
            res.status(200).send({status: 'Success', payload: `Producto eliminado correctamente`});
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

export default router