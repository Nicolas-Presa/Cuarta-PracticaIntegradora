import { CartServices } from '../../services/cart.services.js'

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
    
    async addProductToCart(cartId, newProduct) {
        try{
            return await services.addProductToCartServices(cartId, newProduct)
        }catch(err){
            return err.message
        }
    }


    async deleteProductToCart(cartId, productId) {
        try{
            return await services.deleteProductToCartServices(cartId, productId);
        }catch(err){
            return err.message
        }
    }

    async updateCart(cartId, arrayProducts) { 
        try{
            return await services.updateCartServices(cartId, arrayProducts)
        }catch(err){
            return err.message
        }
    }

    async updateCartProduct(cartId, productId, newQuantity) {
        try{
            return await services.updateCartProductServices(cartId, productId, newQuantity)
        }catch(err){
            return err.message
        }
    }
    


    async deleteProducts(cartId) {
        try{
            return await services.deleteProductsServices(cartId)
        }catch(err){
            return err.message
        }
    }
}



export { CartManager }