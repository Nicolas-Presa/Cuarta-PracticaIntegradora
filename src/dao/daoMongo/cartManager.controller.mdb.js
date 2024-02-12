import cartModel from '../models/cart.model.js'

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
        try {
            const cart = await cartModel.findById(id).populate('products.productId').lean();
            return cart;
        } catch (err) {
            return err.message;
        }
    };
    
    async addProductToCart(cartId, newProduct) {
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


    async deleteProductToCart(cartId, productId) {
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

    async updateCart(cartId, arrayProducts) { 
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

    async updateCartProduct(cartId, productId, newQuantity) {
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
    


    async deleteProducts(cartId) {
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



export { CartManager }