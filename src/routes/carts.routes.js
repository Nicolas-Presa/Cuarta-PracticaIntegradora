import { Router } from "express";
import { CartManager } from "../dao/daoMongo/cartManager.controller.mdb.js";

const router = Router();
const controller = new CartManager();


router.post('/', async(req, res) => {
    try{
        const newcart = req.body;
        const cart = await controller.addCart(newcart);
        res.status(200).send({status: 'OK', payload: cart });
    }catch(err){
        res.status(400).send({status: 'error', payload: err.message})
    }
})


router.get('/', async(req, res) => {
    try{
        const carts = await controller.getCarts();
        res.status(200).send({status: 'OK', payload: carts})
    }catch(err){
        res.status(400).send({status: 'error', payload: err.message})
    }
})


router.get('/:cid', async(req, res) =>{
    try{
        const cartId = req.params.cid;
        let cart = await controller.getCartsById(cartId);
        res.status(200).send({status: 'OK', payload: cart})
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})


router.post('/:cid/products/:pid', async (req, res) => {
    try{
        const cartId = req.params.cid;
        const productId = req.params.pid

        const product = await controller.addProductToCart(cartId, productId);
        res.status(200).send({status: 'Success', payload: product})
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
});


router.put('/:cid', async(req, res) => {
    try{
        const idCart = req.params.cid
        const products = req.body.products

        const updateCart = await controller.updateCart(idCart, products);

        if(updateCart){
            res.status(200).send({status: 'Success', payload: updateCart});
        }else{
            res.status(500).send({status: 'error', payload: 'El carrito no pudo ser actualizado'});
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})


router.put('/:cid/products/:pid', async(req, res) =>{
    try{
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body

        const update = await controller.updateCartProduct(cartId, productId, quantity);

        if(update){
            res.status(200).send({status: 'Success', payload: update})
        }else{
            res.status(500).send({status: 'error', payload: 'Error al actualizar el producto'});
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try{
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const productRemoved = await controller.deleteProductToCart(cartId, productId);

        if(productRemoved){
            res.status(200).send({status: 'Success', data: 'Producto eliminado correctamente'});
        } else {
            res.status(500).send({status: 'Error', data: 'Error al eliminar el producto o no encontrado'});
        }
    } catch(err){
        res.status(500).send({status: 'Error', payload: err.message});
    }
})


router.delete('/:cid', async(req, res) => {
    try{
        const cartId = req.params.cid
        const deleteProducts = await controller.deleteProducts(cartId);

        if(deleteProducts){
            res.status(200).send({status: 'Success', payload: deleteProducts});
        }else{
            res.status(500).send({status: 'error', payload: 'Error al eliminar los productos del carrito'});
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }

})

export default router