import { Router } from "express";
import { ProductManager } from '../controllers/product.controller.mdb.js'
import handlePolicies from '../auth/policies.auth.js'
import { ProductDTO } from "../repositories/products.repository.js";
import CustomError from '../services/error.custom.class.js';
import errorsDictionary from "../services/error.dictionary.js";

const router = Router();
const controller = new ProductManager();


router.get('/', async (req, res, next) => {
    const { filter, limit, page} = req.query

    if(filter && limit && page){
        const products = await controller.getProducts(filter, limit, page)
        res.status(200).send({status: 'Success', payload: products})
    }else{
        return next(new CustomError(errorsDictionary.FEW_FILTERS));
    }
})

router.get('/:pid([a-fA-F0-9]{24})', async(req, res, next) => {
        let productPid = req.params.pid;
        let product = await controller.getProductById(productPid);

        if(product){
            return res.status(200).send({status: 'Success', payload: product});
        }else{
            return next(new CustomError(errorsDictionary.ID_NOT_FOUND))
        }
})

router.post('/', async (req, res, next) => {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body
        
        if(title && description && code && price && status && stock && category && thumbnails){
            const newContent = { title, description, code, price, status, stock, category, thumbnails};
            const normalizedProduct = new ProductDTO(newContent);
            const productComplete = normalizedProduct.getProduct();
            const result = await controller.addProduct(productComplete);

            res.status(200).send({status: 'Success', payload: result})
        }else{
            return next(new CustomError(errorsDictionary.FEW_PARAMETERS));
        }
    })

    router.put('/:pid([a-fA-F0-9]{24})', handlePolicies(['ADMIN']), async (req, res, next) => {
        let updateProduct = req.body;
        let productPid = req.params.pid;

        if(!updateProduct && !productPid){
            return next(new CustomError(errorsDictionary.FEW_PARAMETERS))
        }

        await controller.updateProduct(productPid, updateProduct);
        const newProduct = await controller.getProductById(productPid);

        if(newProduct){
            res.status(200).send({status: 'Success', data: newProduct});
        }else{
            return next(new CustomError(errorsDictionary.ID_NOT_FOUND))
        }
});



router.delete('/:pid([a-fA-F0-9]{24})', handlePolicies(['ADMIN']), async (req, res, next) => {
        const productPid = req.params.pid;
        await controller.deleteProduct(productPid);

        if(productPid){
            res.status(200).send({status: 'Success', payload: `Producto eliminado correctamente`});
        }else{
            return next(new CustomError(errorsDictionary.ID_NOT_FOUND))
        }
})


router.get('/mockingproducts/:qty', async(req, res) => {
    try{
        const products = await controller.generateMockProducts(req.params.qty);
        res.status(200).send({status: 'Success', payload: products});
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})

export default router