import cartModel from '../dao/models/cart.model.js'


class CartServices {
    constructor(){}


    addCartServices = async(newCart) => {
        try{
            const cart = await cartModel.create(newCart)
            return cart
        }catch(err){
            return err.message
        }
    }

    getCartsServices = async() => {
        try{
            const carts = await cartModel.find().lean()
            return carts
        }catch(err){
            return err.message
        }
    }

    getCartsByIdServices = async(id) => {
        try {
            const cart = await cartModel.findById(id).populate('products.productId').lean();
            return cart;
        } catch (err) {
            return err.message;
        }
    };
    
    async addProductToCartServices(cartId, newProduct) {
        try{
            const cart = await cartModel.findById(cartId);
            if(!cart){
                console.log('El carrito no existe');
            }else{
                const productIndex = cart.products.findIndex(p => p.productId.toString() === newProduct);
                if(productIndex > -1){
                    cart.products[productIndex].quantity += 1;
                    await cart.save();
                    return cart
                }else{
                    cart.products.push({productId: newProduct, quantity: 1})
                    await cart.save();
                    return cart
                }
            }
        }catch(err){
            return err.message
        }
    }


    async deleteProductToCartServices(cartId, productId) {
        try{
            const cart = await cartModel.findById(cartId);
            if(!cart){
                console.log('Este carrito no existe');
            }else{
                const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
                if(productIndex > -1){
                    if(cart.products[productIndex].quantity > 1){
                        cart.products[productIndex].quantity -= 1
                    }else{
                        cart.products.splice(productIndex, 1)
                    }
                    await cart.save();
                    return cart;
                }else{
                    console.log('producto no encontrado')
                    return null
                }
            }
        }catch(err){
            return err.message
        }
    }

    async updateCartServices(cartId, arrayProducts) { 
        try{
            const updateCart = await cartModel.findByIdAndUpdate(
                cartId,
                {$set: {products: arrayProducts}},
                {new: true}
            );
            return updateCart
        }catch(err){
            return err.message
        }
    }

    async updateCartProductServices(cartId, productId, newQuantity) {
        try{
            const updateCartProduct = await cartModel.findOneAndUpdate(
                { _id: cartId, 'products.productId': productId },
                { $set: { 'products.$.quantity': newQuantity} },
                { new: true }
            )
            return updateCartProduct
        }catch(err){
            return err.message
        }
    }
    


    async deleteProductsServices(cartId) {
        try{
            const deleteProducts = await cartModel.findByIdAndUpdate(
                cartId,
                { $set: { products: [] } },
                { new: true }
            );
            return deleteProducts
        }catch(err){
            return err.message
        }
    }
}


export { CartServices }