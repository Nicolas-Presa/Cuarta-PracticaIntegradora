import { Router } from "express";
import {ProductManager} from '../controllers/product.controller.mdb.js'
import {CartManager} from '../controllers/cart.controller.mdb.js'
import config from '../config.js'
import jwt from 'jsonwebtoken'
import handlePolicies from "../auth/policies.auth.js";

const router = Router();
const productController = new ProductManager();
const cartController = new CartManager();

router.get('/products',  async (req, res) => {
    try {
        if(req.user){
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
            user: req.user
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


router.get('/restore/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, config.JWT_SECRET);

        res.render('restore', { token });
    } catch (error) {
        res.redirect('/login'); 
    }
});


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

router.get('/addProduct', async(req, res) =>{
    try{
        if(req.user){
            res.render('addProduct', {user: req.user})
        }else{
            res.redirect('/login')
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

router.get('/role', async(req, res) => {
    try{
        if(req.user){
            res.render('role', {user: req.user})
        }else{
            res.redirect('/login')
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})



export default router