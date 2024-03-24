import { Router } from "express";

const router = Router();


router.get('/loggertest', async(req, res) => {
    try{
        req.logger.debug('Este es un error de tipo debug');
        req.logger.http('Este es un error de tipo http');
        req.logger.info('Este es un error de tipo info');
        req.logger.warning('Este es un error de tipo warning');
        req.logger.error('Este es un error de tipo error');
        req.logger.fatal('Este es un error de tipo fatal');

        res.status(200).send({status: 'Success', payload: 'Prueba de errores en ejecucion'});
    }catch(err){
        res.status(400).send({status: 'errror', payload: err.message});
    }
})

export default router