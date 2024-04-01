import { Router } from "express";
import { UserManager } from "../controllers/user.controller.mdb.js";


const router = Router();
const controller = new UserManager();

router.put('/premium/:uid([a-fA-F0-9]{24})', async(req, res) => {
    try{
        const userUid = req.params.uid;
        const {role: newRole} = req.body

            if(!userUid && !newRole){
                req.logger.error('Parametros insuficientes');
                return next(new CustomError(errorsDictionary.FEW_PARAMETERS));
            }

            const updateRole = await controller.updateRole(userUid, newRole);

            if(updateRole){
                req.logger.info(`el usuario acaba de modificar ${JSON.stringify(updateRole, null, 2)}`);
                res.status(200).send({status: 'Success', data: updateRole});
            }else{
                req.logger.info('el ID debe coincidir con el otorgado por mongoDB')
                return next(new CustomError(errorsDictionary.ID_NOT_FOUND))
            }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})



export default router