import { Router } from "express";
import { ProductManager } from '../controllers/product.controller.mdb.js'
import handlePolicies from '../auth/policies.auth.js'
import { ProductDTO } from "../repositories/products.repository.js";
import CustomError from '../services/error.custom.class.js';
import errorsDictionary from "../services/error.dictionary.js";
import { uploaderProducts } from "../uploader.js";
import { sendProductDeleteConfirmation } from "../utils.js";
import userModel from "../models/user.model.js";

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

router.post('/', uploaderProducts.single('thumbnails'),  async (req, res, next) => {
        const thumbnails = req.file.path
        const owner = req.user.email
        const { title, description, code, price, stock, category } = req.body

        if(!title || !description || !code || !price || !stock || !category || !thumbnails || !owner){
            return next(new CustomError(errorsDictionary.FEW_PARAMETERS))
        }

        const newContent = { title, description, code, price, stock, category, thumbnails, owner};
        const normalizedProduct = new ProductDTO(newContent);
        const productComplete = normalizedProduct.getProduct();

        const result = await controller.addProduct(productComplete);
        if(result){
            req.logger.info(`el usuario ${owner} acaba de agregar ${JSON.stringify(productComplete, null, 2)}`)
            // res.status(200).send({status: 'Success', payload: result})
            res.redirect('/products')
        }else{
            return next(new CustomError(errorsDictionary.DATABASE_ERROR))
        }
    })

    router.put('/:pid([a-fA-F0-9]{24})',  async (req, res, next) => {
        const productPid = req.params.pid;
        const newData = req.body;
        console.log(newData)

        const product = await controller.getProductById(productPid);
        if(!product){
            return next(new CustomError(errorsDictionary.ID_NOT_FOUND))
        }

        if(Object.keys(newData).length === 0){
            return next(new CustomError(errorsDictionary.FEW_PARAMETERS));
        }

        const updateProduct = await controller.updateProduct(productPid, newData);

        if(updateProduct){
            req.logger.info(`el usuario acaba de modificar ${JSON.stringify(updateProduct, null, 2)}`);
            res.status(200).send({status: 'Success', payload: updateProduct});
        }else{
            return next(new CustomError(errorsDictionary.DATABASE_ERROR))
        }
});



router.delete('/:pid([a-fA-F0-9]{24})', async (req, res, next) => {
        const productPid = req.params.pid;
        const email = req.user.email;
        const role = req.user.role;

        if(!productPid || !email || !role){
            return next(new CustomError(errorsDictionary.FEW_PARAMETERS));
        }

        const product = await controller.getProductById(productPid);
        if(!product){
            return next(new CustomError(errorsDictionary.ID_NOT_FOUND));
        }

        const userEmail = product.owner
        const user = await userModel.findOne({email: userEmail});
        if(!user){
            return next(new CustomError(errorsDictionary.ID_NOT_FOUND));
        }

        if(email !== product.owner || role !== 'admin'){
            return next(new CustomError(errorsDictionary.INVALID_ROLE))
        }

        if(email === product.owner || role === 'admin'){
            const deleteProduct = await controller.deleteProduct(productPid)

            if(user.role === 'premium'){
                await sendProductDeleteConfirmation(deleteProduct, userEmail);
            }

            req.logger.warning(`El usuario ${email} acaba de eliminar ${JSON.stringify(deleteProduct, null, 2)}`)
            res.status(200).send({status: 'Success', payload: deleteProduct});
        }else{
            return next(new CustomError(errorsDictionary.INVALID_ROLE))
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