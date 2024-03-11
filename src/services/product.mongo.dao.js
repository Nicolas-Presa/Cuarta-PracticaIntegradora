import productModel from '../models/product.model.js';
import { faker } from '@faker-js/faker';

class ProductServices {
    constructor(){}

    async addProductServices(product) {
        try{
            productModel.create(product)
            return 'Product agregado'
        }catch(err){
            return err.message
        }
    }

    async getProductsServices(filter, limit, page, sort = 'asc'){
        try {
            const sortOrder = sort === 'asc' ? 1 : sort === 'desc' ? -1 : undefined;

            let query = {};
            if (filter) {
                query.category = filter;
            }
    
            const process = await productModel.paginate(
                query,
                {
                    limit: limit,
                    page: page,
                    sort: sortOrder ? { price: sortOrder } : undefined,
                    lean: true,
                }
            );
            return process;
        } catch (err) {
            return err.message;
        }
    }

    async getProductsByIdServices(id) {
        try{
            const product = productModel.findById(id)
            return product
        }catch(err){
            return err.message
        }
    }

    async updateProductServices(id, newData) {
        try{
            const product = await productModel.findByIdAndUpdate(id, newData)
            return product
        }catch(err){
            return err.message
        }
    }

    deleteProductServices = async (id) => {
        try{
            const product = await productModel.findByIdAndDelete(id)
            return product
        }catch(err){
            return err.message
        }
    }

    generateMockProductServices(qty){
        try{
            const mockProducts = [];
            const possibleCategory = ['remera' , 'pantalon', 'campera']

            for(let i = 0; i < qty; i++){
                const product = {
                    _id: faker.database.mongodbObjectId(),
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    code: faker.string.binary({ length: 10 }),
                    price: faker.commerce.price(),
                    status: faker.datatype.boolean(0.9),
                    stock: faker.number.octal({ min: 0, max: 80 }),
                    category: faker.helpers.arrayElement(Object.values(possibleCategory)),
                    thumbnails: faker.datatype.boolean(0.0)
                };
                mockProducts.push(product)
            }
            return mockProducts

        }catch(err){
            return err.message
        }
    }
}


export { ProductServices }