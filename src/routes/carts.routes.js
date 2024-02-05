import { Router } from "express";
// import { CartManager } from "../controllers/cartManager.controller.fs.js";
import { CartManager } from "../dao/daoMongo/cartManager.controller.mdb.js";

const router = Router();
const controller = new CartManager();
// const manager1 = new CartManager('./carts.json');



router.get('/:cid', async(req, res) =>{
    try{
        const cartId = req.params.cid;
        let cart = await controller.getCartsById(cartId);
        res.status(200).send({status: 'OK', data: cart})
    }catch(err){
        res.status(400).send({status: 'ERR', data: err.message})
    }
})


router.post('/', async(req, res) => {
    try{
        const newcart = req.body;
        const cart = await controller.addCart(newcart);
        res.status(200).send({status: 'OK', data: cart });
    }catch(err){
        res.status(400).send({status: 'ERR', data: err.message})
    }
})


router.post('/:cid/products/:pid', async (req, res) => {
    try{
        const cartId = req.params.cid;
        const productId = req.params.pid

        const product = await controller.addProductToCart(cartId, productId);
        res.status(200).send({status: 'OK', data: product})
    }catch(err){
        res.status(400).send({status: 'ERR', data: err.message})
    }
});

export default router