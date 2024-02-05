import productModel from '../models/product.model.js'

class ProductManager{
    constructor(){}

    async addProduct(product) {
        try{
            productModel.create(product)
            return 'Product agregado'
        }catch(err){
            return err.message
        }
    }

    getProducts = async() => {
        try{
        const products = await productModel.find().lean();
        return products
        }catch(err){
            return err.message
        }
    }

    getProductById = async (id) => {
        try{
            const product = productModel.findById(id)
            return product
        }catch(err){
            return err.message
        }
    }
    
    async updateProduct(id, newData) {
        try{
            const product = productModel.findByIdAndUpdate(id, newData)
            return product
        }catch(err){
            return err.message
        }
    }

    deleteProduct = async (id) => {
        try{
            const product = productModel.findByIdAndDelete(id)
            return product
        }catch(err){
            err.message
        }
    }
}

export {ProductManager}