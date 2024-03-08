import { ProductServices } from '../services/product.mongo.dao.js'

const services = new ProductServices();

class ProductManager{
    constructor(){}

    async addProduct(product) {
        try{
            return await services.addProductServices(product)
        }catch(err){
            return err.message
        }
    }

    getProducts = async (filter, limit, page, sort = 'asc') => {
        try {
            return await services.getProductsServices(filter, limit, page, sort = 'asc')
        } catch (err) {
            return err.message;
        }
    };
    
    

    getProductById = async (id) => {
        try{
            return await services.getProductsByIdServices(id)
        }catch(err){
            return err.message
        }
    }
    
    async updateProduct(id, newData) {
        try{
            return await services.updateProductServices(id, newData)
        }catch(err){
            return err.message
        }
    }

    deleteProduct = async (id) => {
        try{
            return await services.deleteProduct(id)
        }catch(err){
            err.message
        }
    }
}

export {ProductManager}