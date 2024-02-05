import fs from 'fs'


class CartManager{
    constructor(path){
        this.path = path;
        this.cart = [];
        this.idCart = 0;
    }

    async loadCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            if (data.trim() !== '') {
                this.cart = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error reading file:', error.message);
        }
    }

    async saveCarts() {
        if (this.cart.length > 0) {
            const productJson = JSON.stringify(this.cart, null, 2);
            try {
                await fs.promises.writeFile(this.path, productJson);
            } catch (error) {
                console.error('Error writing to file:', error.message);
            }
        }
    }

    addCart = async(cart) => {
        await this.loadCarts();

        const maxId = this.cart.reduce((max, product) => (product.id > max ? product.id : max), 0);
        const newProductId = maxId + 1;

        cart.id = newProductId;
        this.cart.push(cart);

        this.saveCarts();
    }

    getCarts = async(limit) => {
        this.loadCarts();

        if (limit) {
            return this.cart.slice(0, limit);
        } else {
            return this.cart
        }
    }

    getCartsById = async(id) => {
        await this.loadCarts();

        const cart = this.cart.find(cart => cart.id === id);
        
        if(!cart){
            console.log('ERROR, Cart not found');
        }else{
            return {products: cart.products}
        }
    }

    async addProductToCart(cartId, newProduct) {
        try {
        await this.loadCarts();
    
        const cart = this.cart.find(cart => cart.id === cartId);
    
        if (cart) {
            const product = cart.products.find(product => product.id === newProduct.id);
            if (product) {
            product.quantity += newProduct.quantity;
            console.log(`Se ha incrementado la cantidad del producto con ID ${newProduct.id} en el carrito con ID ${cartId}.`);
            } else {
            cart.products.push(newProduct);
            console.log(`Nuevo producto agregado al carrito con ID ${cartId}.`);
            }
            await this.saveCarts();
        } else {
            console.log(`No se encontró un carrito con ID ${cartId}.`);
        }
        } catch (error) {
        console.error('Error adding product to cart:', error.message);
        }
    }

    
    
    
}



export { CartManager }