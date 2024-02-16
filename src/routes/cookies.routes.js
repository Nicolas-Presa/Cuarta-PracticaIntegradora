import { Router } from "express";

const router = Router();

router.post('/', (req, res ) => {
    try{
        res.cookie('userCookie', {user: req.body.user, email: req.body.email}, {maxAge: 50000, signed: true})
        res.status(200).send({status: 'Success', payload: 'Nueva cookie generada'})
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})

router.get('/getCookies', (req, res) => {
    try{
        res.status(200).send({status: 'Success', payload: req.signedCookies})
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

router.get('/deleteCookie', (req, res) => {
    try{
        res.clearCookie('userCookie')
        res.status(200).send('Cookie eliminada');
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})


export default router