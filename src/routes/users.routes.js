import { Router } from "express";
import { UserManager } from "../controllers/user.controller.mdb.js";
import CustomError from '../services/error.custom.class.js';
import errorsDictionary from "../services/error.dictionary.js";
import { uploaderDocument } from "../uploader.js";
import { sendUsersDeleteConfirmation } from "../utils.js";
import handlePolicies from '../auth/policies.auth.js'


const router = Router();
const controller = new UserManager();



router.get('/', async(req, res, next) => {
    const users = await controller.getUsers();
    
    const filteredUsers = users.map(({first_name, last_name, age, __v, _id, password, thumbnails, cartId, documents, last_connection, ...rest }) => rest);

    if(filteredUsers){
        res.status(200).send({status: 'Success', payload: filteredUsers})
    }else{
        return next(new CustomError(errorsDictionary.DATABASE_ERROR));
    }
})

router.post('/:uid/documents', uploaderDocument.fields([
    { name: 'documents[0][reference]', maxCount: 1 },
    { name: 'documents[1][reference]', maxCount: 1 },
    { name: 'documents[2][reference]', maxCount: 1 }
]), async (req, res, next) => {
    const userId = req.params.uid;

    if (!userId) {
    return next(new CustomError(errorsDictionary.FEW_PARAMETERS));
    }
    
    const user = await controller.getUserById(userId);
    if (!user) {
    return next(new CustomError(errorsDictionary.ID_NOT_FOUND));
    }

    const documents = req.body.documents.map((doc, index) => {
    const fileArray = req.files[`documents[${index}][reference]`];
    if (!fileArray || fileArray.length === 0) {
        return null;
    }
    const file = fileArray[0];
    return {
        name: doc.name,
        reference: file.path,
    };
    });

    if (documents.includes(null)) {
    return next(new CustomError(errorsDictionary.FEW_PARAMETERS));
    }

    try {
    const updatedUser = await controller.updateRoleToPremium(userId, documents);
    res.status(200).send({status: 'Success', payload: updatedUser});
    } catch (error) {
    return next(new CustomError(errorsDictionary.DATABASE_ERROR));
    }
});

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


router.delete('/delete', async(req, res, next) => {
    const users = await controller.getUsers();
    if(!users){
        return next(new CustomError(errorsDictionary.DATABASE_ERROR));
    }

    const twoDaysAgo = new Date(new Date().getTime() - (2 * 60 * 1000));

    const usersToDelete = users.filter(users => {
        return users.last_connection_date < twoDaysAgo
    })
    
    if(usersToDelete.length === 0){
        return next(new CustomError(errorsDictionary.NO_ACTIVE_USERS));
    }

    const usersIdsToDelete = usersToDelete.map(user => {
        return user._id
    })

    const result = await controller.deleteUsersById(usersIdsToDelete);

    if(result){
        try{
            const filteredUsers = usersToDelete.map(({first_name, last_name, age, __v, _id, password, thumbnails, cartId, documents, last_connection, last_connection_date, ...rest }) => rest);
            await sendUsersDeleteConfirmation(filteredUsers)
            res.status(200).send({status: 'Success', payload: result, usersDelete: filteredUsers})
        }catch(err){
            res.status(500).send({status:'error', payload: 'Error en el envio de mails'})
        }
    }else{
        return next(new CustomError(errorsDictionary.DATABASE_ERROR))
    }
})


router.delete('/deletefromadmin/:uid', handlePolicies(['ADMIN']), async(req, res, next) => {
    const userId = req.params.uid;

    const user = await controller.getUserById(userId);
    if(!user){
        return next(new CustomError(errorsDictionary.ID_NOT_FOUND));
    }

    const deleteUser = await controller.deleteUserById(userId);
    if(deleteUser){
        res.status(200).send({status: 'Success', payload: deleteUser})
    }else{
        return next(new CustomError(errorsDictionary.DATABASE_ERROR))
    }
})



export default router