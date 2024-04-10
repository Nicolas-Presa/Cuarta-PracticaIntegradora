import { Router } from "express";
import { CartManager } from "../controllers/cart.controller.mdb.js";
import { ProductManager } from "../controllers/product.controller.mdb.js";
import handlePolicies from "../auth/policies.auth.js";
import CustomError from "../services/error.custom.class.js";
import errorsDictionary from "../services/error.dictionary.js";

const router = Router();
const controller = new CartManager();
const productController = new ProductManager();


router.post('/', async(req, res, next) => {
    const newCart = req.body

    if(newCart){
        const cart = await controller.addCart(newCart)
        res.status(200).send({status: 'Success', payload: cart})
    }else{
        return next(new CustomError(errorsDictionary.USER_NOT_FOUND));
    }
})


router.get('/', async(req, res, next) => {
    const carts = await controller.getCarts()

    if(carts){
        res.status(200).send({status: 'Success', payload: carts})
    }else{
        return next(new CustomError(errorsDictionary.DATABASE_ERROR))
    }
})


router.get('/:cid([a-fA-F0-9]{24})', async(req, res, next) =>{
    const cartId = req.params.cid;

    if(!cartId){
        return next(new CustomError(errorsDictionary.FEW_PARAMETERS));
    }

    const cart = await controller.getCartsById(cartId);
    if(cart){
        res.status(200).send({status: 'Success', payload: cart})
    }else{
        return next(new CustomError(errorsDictionary.ID_NOT_FOUND))
    }
})


router.post('/:cid([a-fA-F0-9]{24})/products/:pid([a-fA-F0-9]{24})', async (req, res, next) => {
    const cartId = req.params.cid;
    const productId = req.params.pid
    const email = 'soyunemail'

    if(!cartId || !productId || !email){
        return next(new CustomError(errorsDictionary.FEW_PARAMETERS))
    }

    const cart = await controller.getCartsById(cartId);
    const product = await productController.getProductById(productId);
    if(!cart || !product){
        return next(new CustomError(errorsDictionary.ID_NOT_FOUND));
    }

    if(product.owner === email ){
        return next(new CustomError(errorsDictionary.PURCHASE_RESTRICTION))
    }

    const productToCart = await controller.addProductToCart(cartId, productId)

    if(productToCart){
        res.status(200).send({status: 'Success', payload: productToCart})
    }else{
        return next(new CustomError(errorsDictionary.ERROR_ADDING))
    }
});


// router.put('/:cid([a-fA-F0-9]{24})', async(req, res) => {
//     try{
//         const idCart = req.params.cid
//         const products = req.body.products

//         const updateCart = await controller.updateCart(idCart, products);

//         if(updateCart){
//             req.logger.info('El carrito esta siendo actualizado');
//             res.status(200).send({status: 'Success', payload: updateCart});
//         }else{
//             res.status(500).send({status: 'error', payload: 'El carrito no pudo ser actualizado'});
//         }
//     }catch(err){
//         res.status(500).send({status: 'error', payload: err.message});
//     }
// })


// router.put('/:cid([a-fA-F0-9]{24})/products/:pid([a-fA-F0-9]{24})', async(req, res) =>{
//     try{
//         const cartId = req.params.cid;
//         const productId = req.params.pid;
//         const { quantity } = req.body

//         const update = await controller.updateCartProduct(cartId, productId, quantity);

//         if(update){
//             req.logger.info('Se acaba de ejecutar una acciona que podria modificar la estructura del carrito')
//             res.status(200).send({status: 'Success', payload: update})
//         }else{
//             res.status(500).send({status: 'error', payload: 'Error al actualizar el producto'});
//         }
//     }catch(err){
//         res.status(500).send({status: 'error', payload: err.message});
//     }
// })

router.delete('/:cid([a-fA-F0-9]{24})/products/:pid([a-fA-F0-9]{24})', async (req, res, next) => {
    const cartId = req.params.cid;
    const productId = req.params.pid

    if(!cartId || !productId){
        return next(new CustomError(errorsDictionary.FEW_PARAMETERS));
    }

    const cart = await controller.getCartsById(cartId);
    const product = await productController.getProductById(productId);
    if(!cart || !product){
        return next(new CustomError(errorsDictionary.ID_NOT_FOUND));
    }

    const deleteProduct = await controller.deleteProductToCart(cartId, productId);

    if(deleteProduct === null){
        return next(new CustomError(errorsDictionary.PRODUCT_NOT_FOUND));
    }

    if(deleteProduct){
        res.status(200).send({status: 'Success', payload: deleteProduct});
    }else{
        return next(new CustomError(errorsDictionary.DATABASE_ERROR))
    }
})


router.delete('/:cid([a-fA-F0-9]{24})', async(req, res, next) => {
    const cartId = req.params.cid

    if(!cartId){
        return next(new CustomError(errorsDictionary.FEW_PARAMETERS))
    }

    const cart = await controller.getCartsById(cartId)
    if(!cart){
        return next(new CustomError(errorsDictionary.ID_NOT_FOUND))
    }

    if(cart.total === 0){
        return next(new CustomError(errorsDictionary.EMPTY_CART))
    }

    const emptyCart = await controller.emptyCart(cartId);

    if(emptyCart){
        res.status(200).send({status: 'Success', payload: emptyCart})
    }else{
        return next(new CustomError(errorsDictionary.DATABASE_ERROR))
    }
})


router.get('/:cid/purchase', async(req, res, next) => {
    const cartId = req.params.cid
    const userEmail = req.user.email

    if(!cartId || !userEmail){
        return next(new CustomError(errorsDictionary.FEW_PARAMETERS))
    }

    const cart = await controller.getCartsById(cartId)
    if(!cart){
        return next(new CustomError(errorsDictionary.FEW_PARAMETERS))
    }

    if(cart.total === 0){
        return next(new CustomError(errorsDictionary.EMPTY_CART))
    }

    const buys = await controller.processPurchase(cartId, userEmail)

    if(buys){
        res.status(200).send({status: 'Success', payload: buys})
    }else{
        return next(new CustomError(errorsDictionary.DATABASE_ERROR))
    }
})

export default router