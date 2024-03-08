import { Router } from "express";
import {ProductManager} from '../controllers/product.controller.mdb.js'
import {CartManager} from '../controllers/cart.controller.mdb.js'

const router = Router();
const productController = new ProductManager();
const cartController = new CartManager();

router.get('/products', async (req, res) => {
    try {
        if(req.user && req.user.role === 'admin'){
        let filter = req.query.filter;
        let limit = parseInt(req.query.limit, 10) || 10;
        let page = parseInt(req.query.page, 10) || 1;
        let sort = req.query.sort;

        const products = await productController.getProducts(filter, limit, page, sort);
        products.pages = [];
        for (let i = 1; i <= products.totalPages; i++) {
            products.pages.push(i);
        }

        res.render('products', {
            
            title: 'Productos',
            products: products,
            user: req.session.user
        });
        }else{
            res.redirect('/api/sessions/failproducts');
        }
    } catch (err) {
        res.status(500).send({ status: 'error', payload: err.message });
    }
});


router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        let cart = await cartController.getCartsById(cartId);

        res.render('cart', {
            title: 'Tu Carrito de compras',
            cart: cart
        });
    } catch (err) {
        res.status(500).send({status: 'error', payload: err.message});
    }
});


router.get('/register', (req, res) => {
    try{
        if(req.user){
            res.redirect('/profile')
        }else{
            res.render('register', {})
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

router.get('/login', (req, res) =>{
    try{
        if(req.user){
            res.redirect('/profile')
        }else{
            res.render('login')
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

router.get('/restore', (req, res) => {
    try{
        if(req.user){
            res.redirect('/profile')
        }else{
            res.render('restore', {})
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

router.get('/profile', (req, res) => {
    try{
        if(req.user){
            res.render('profile', {user: req.user})
        }else{
            res.redirect('/login')
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

router.get('/message', async(req, res) =>{
    try{
        if(req.user){
            res.render('messages', {user: req.user})
        }else{
            res.redirect('/login')
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})



export default router