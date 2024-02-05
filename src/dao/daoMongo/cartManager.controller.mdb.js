import cartModel from '../models/cart.model.js.js'

class CartManager{
    constructor(){}

    addCart = async(newCart) => {
        try{
            const cart = await cartModel.create(newCart)
            return cart
        }catch(err){
            return err.message
        }
    }

    getCarts = async() => {
        try{
            const carts = await cartModel.find().lean()
            return carts
        }catch(err){
            return err.message
        }
    }

    getCartsById = async(id) => {
        try{
            const cart = await cartModel.findById(id)
            return cart
        }catch(err){
            return err.message
        }
    }

    async addProductToCart(cartId, newProduct) {
        try{
            const cart = await cartModel.findById(cartId);
            if(!cart){
                console.log('El carrito no existe');
            }else{
                const productIndex = cart.products.findIndex(p => p.id === newProduct);
                if(productIndex > -1){
                    cart.products[productIndex].quantity += 1;
                    await cart.save();
                    return cart
                }else{
                    cart.products.push({id: newProduct, quantity: 1})
                    await cart.save();
                    return cart
                }
            }
        }catch(err){
            return err.message
        }
    }
    
}



export { CartManager }