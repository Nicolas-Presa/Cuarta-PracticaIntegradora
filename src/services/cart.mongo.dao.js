import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'
import ticketModel from '../models/ticket.model.js'


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
    
    async addProductToCartServices(cartId, newProduct, email) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                console.log('El carrito no existe');
                return;
            }
            const productToAdd = await productModel.findById(newProduct);
            if (!productToAdd) {
                console.log('El producto no existe');
                return;
            }

            if(productToAdd.owner === email){
                console.log('No es posible añadir este producto')
            }

            const productIndex = cart.products.findIndex(p => p.productId.toString() === newProduct.toString());
    
            if (productIndex > -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ productId: newProduct, quantity: 1 });
            }
    
            let total = 0;
            for (let item of cart.products) {
                const product = await productModel.findById(item.productId);
                const price = Number(product.price);
                total += price * item.quantity;
            }
    
            cart.total = total;
    
            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error al agregar producto al carrito:', err.message);
            return err.message;
        }
    }


    async deleteProductToCartServices(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                console.log('Este carrito no existe');
                return;
            }
    
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex > -1) {
                const product = await productModel.findById(productId);
                if (!product) {
                    console.log('Producto no encontrado en la base de datos');
                    return;
                }
    
                const productPrice = Number(product.price);
    
                if (cart.products[productIndex].quantity > 1) {
                    cart.products[productIndex].quantity -= 1;
                    cart.total -= productPrice;
                } else {
                    cart.total -= productPrice * cart.products[productIndex].quantity;
                    cart.products.splice(productIndex, 1);
                }
    
                await cart.save();
                return cart;
            } else {
                console.log('Producto no encontrado en el carrito');
                return null;
            }
        } catch (err) {
            console.error('Error al eliminar producto del carrito:', err);
            return err.message;
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

    async processPurchase(cartId, userEmail) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.productId');
            if (!cart) throw new Error('Carrito no encontrado');
    
            for (const item of cart.products) {
                const product = await productModel.findById(item.productId);
                if (product.stock < item.quantity) {
                    throw new Error(`Stock insuficiente para el producto: ${product.title}`);
                }
            }
    
            let totalAmount = 0;
            for (const item of cart.products) {
                const product = await productModel.findById(item.productId);
                product.stock -= item.quantity;
                await product.save();
    
                totalAmount += product.price * item.quantity;
            }
    
            const newTicket = await ticketModel.create({
                purchaser: userEmail,
                amount: totalAmount,
            });
    
            cart.products = [];
            await cart.save();
    
            return newTicket;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export { CartServices }