import { Router } from 'express';
import handlePolicies from "../auth/policies.auth.js";
import messageModel from '../models/message.model.js'

const router = Router();


router.post('/save', handlePolicies(['USER']), async(req, res) =>{
    try{
        const {email, message} = req.body;
        const newMessage = {email, message};
        const result = await messageModel.create(newMessage);
        res.status(200).send({status: 'Success', payload: result});
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

export default router