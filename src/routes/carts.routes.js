import { Router } from "express";
import { CartManager } from "../cartManager.js";

const router = Router();
const manager1 = new CartManager('./carts.json');



router.get('/:cid', async(req, res) =>{
    const cartId = parseInt(req.params.cid);
    let cart = await manager1.getCartsById(cartId);

    if(!cart){
        res.status(400).send('El carrito no existe');
    }else{
        res.status(200).send(cart);
    }
})


router.post('/', async(req, res) => {
    try{
        let newcart = req.body;
        await manager1.addCart(newcart);
        res.status(200).send('Nuevo carrito agregado');
    }catch{
        res.status(400).send('Error al agregar el carrito')
    }
})


router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;

    try {
    const newProduct = { id: productId, quantity: parseInt(quantity) || 1 };

    await manager1.addProductToCart(cartId, newProduct);

    res.status(200).send('Producto agregado al carrito correctamente.');
    } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    res.status(500).send({ error: 'Error interno del servidor.' });
    }
});

export default router