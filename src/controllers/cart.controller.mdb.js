import { CartServices } from '../services/cart.mongo.dao.js'

const services = new CartServices()

class CartManager{
    constructor(){}

    addCart = async(newCart) => {
        try{
            return await services.addCartServices(newCart)
        }catch(err){
            return err.message
        }
    }

    getCarts = async() => {
        try{
            return await services.getCartsServices();
        }catch(err){
            return err.message
        }
    }

    getCartsById = async(id) => {
        try {
            return await services.getCartsByIdServices(id);
        } catch (err) {
            return err.message;
        }
    };
    
    async addProductToCart(cartId, productId) {
        try{
            return await services.addProductToCartServices(cartId, productId)
        }catch(err){
            return err.message
        }
    }

    // async updateCart(cartId, arrayProducts) { 
    //     try{
    //         return await services.updateCartServices(cartId, arrayProducts)
    //     }catch(err){
    //         return err.message
    //     }
    // }

    // async updateCartProduct(cartId, productId, newQuantity) {
    //     try{
    //         return await services.updateCartProductServices(cartId, productId, newQuantity)
    //     }catch(err){
    //         return err.message
    //     }
    // }

    async deleteProductToCart(cartId, productId) {
        try{
            return await services.deleteProductToCartServices(cartId, productId);
        }catch(err){
            return err.message
        }
    }

    async emptyCart(cartId) {
        try{
            return await services.emptyCartServices(cartId)
        }catch(err){
            return err.message
        }
    }


    async processPurchase(cartId, userEmail) {
        try{
            return await services.processPurchase(cartId, userEmail)
        }catch(err){
            return err.message
        }
    }
}




export { CartManager }