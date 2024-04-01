import { Router } from "express";
import { CartManager } from "../controllers/cart.controller.mdb.js";
import handlePolicies from "../auth/policies.auth.js";

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


router.get('/:cid([a-fA-F0-9]{24})', async(req, res) =>{
    try{
        const cartId = req.params.cid;
        let cart = await controller.getCartsById(cartId);
        res.status(200).send({status: 'OK', payload: cart})
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})


router.post('/:cid([a-fA-F0-9]{24})/products/:pid([a-fA-F0-9]{24})', async (req, res) => {
    try{
        const cartId = req.params.cid;
        const productId = req.params.pid
        const email = req.user.email

        const product = await controller.addProductToCart(cartId, productId, email);

        req.logger.info('Se acaba de añadir un nuevo producto al carrito')
        res.status(200).send({status: 'Success', payload: product})
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
});


router.put('/:cid([a-fA-F0-9]{24})', async(req, res) => {
    try{
        const idCart = req.params.cid
        const products = req.body.products

        const updateCart = await controller.updateCart(idCart, products);

        if(updateCart){
            req.logger.info('El carrito esta siendo actualizado');
            res.status(200).send({status: 'Success', payload: updateCart});
        }else{
            res.status(500).send({status: 'error', payload: 'El carrito no pudo ser actualizado'});
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})


router.put('/:cid([a-fA-F0-9]{24})/products/:pid([a-fA-F0-9]{24})', async(req, res) =>{
    try{
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body

        const update = await controller.updateCartProduct(cartId, productId, quantity);

        if(update){
            req.logger.info('Se acaba de ejecutar una acciona que podria modificar la estructura del carrito')
            res.status(200).send({status: 'Success', payload: update})
        }else{
            res.status(500).send({status: 'error', payload: 'Error al actualizar el producto'});
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})

router.delete('/:cid([a-fA-F0-9]{24})/products/:pid([a-fA-F0-9]{24})', async (req, res) => {
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


router.delete('/:cid([a-fA-F0-9]{24})', async(req, res) => {
    try{
        const cartId = req.params.cid
        const deleteProducts = await controller.deleteProducts(cartId);

        if(deleteProducts){
            req.logger.info('Se ejecuto una accion que elimina el carrito completamente y su contenido')
            res.status(200).send({status: 'Success', payload: deleteProducts});
        }else{
            res.status(500).send({status: 'error', payload: 'Error al eliminar los productos del carrito'});
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})


router.get('/:cid/purchase', handlePolicies(['ADMIN']), async(req, res) => {
    try{
        const cartId = req.params.cid;
        const userEmail = req.user.email;
        const cart = await controller.processPurchase(cartId, userEmail);
        res.status(200).send({status: 'Success', payload: cart});
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})

export default router