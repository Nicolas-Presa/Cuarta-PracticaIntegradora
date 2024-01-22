import { Router } from "express";
import { ProductManager } from "../productManager.js";


const router = Router();
const manager1 = new ProductManager('./products.json');
const products = await manager1.getProducts();



router.get('/', async (req, res) => {
    try{
        res.status(200).send( {products} )
    }catch{
        res.status(400).send('Error en la carga de productos');
    }
    
})

router.get('/:pid', async(req, res) => {
    let productPid = parseInt(req.params.pid);
    let product = await manager1.getProductById(productPid);

    if(!product){
        return res.status(400).send( {error: 'Producto no encontrado'} );
    }else{
        return res.status(200).send( {product} );
    }
})

router.post('/', async (req, res) => {
    try{
        const newProduct = req.body;
        await manager1.addProduct(newProduct);
        res.status(200).send('Nuevo producto agregado');
    }catch{
        res.status(400).send('error al agregar producto');
    }
})

router.put('/:pid', async (req, res) => {
    try {
        let updateProduct = req.body;
        let productPid = parseInt(req.params.pid);
        await manager1.updateProduct(productPid, updateProduct);

        const newProduct = await manager1.getProductById(productPid);

        if(!newProduct){
            res.status(500).send('Error al actualizar el producto')
        }else{
            res.status(200).send({newProduct});
        }

    } catch{
        res.status(500).send('Error interno al actualizar el producto');
    }
});


router.delete('/:pid', async (req, res) => {
    const productPid = parseInt(req.params.pid);
    await manager1.deleteProduct(productPid);

    if(!productPid){
        res.status(400).send('producto no encontrado')
    }else{
        res.status(200).send(`Producto eliminado correctamente`);
    }
})

export default router