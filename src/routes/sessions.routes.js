import { Router } from "express";
import initPassport from '../auth/passport.auth.js';
import passport from "passport";
import handlePolicies from '../auth/policies.auth.js'
import { sendConfirmation } from "../utils.js";
import userModel from '../models/user.model.js';
import { createHash} from '../utils.js';
import jwt from 'jsonwebtoken'
import config from '../config.js'
import { uploaderProfile } from '../uploader.js'


initPassport();
const router = Router();


router.get('/failregister', async (req, res) => {
    res.status(400).send({ status: 'ERR', data: 'El email ya existe o faltan datos obligatorios' })
})

router.get('/failrestore', async(req, res) =>{
    res.status(400).send('El mail no existe o faltan campos obligatorios')
})

router.get('/faillogin', async(req, res) => {
    res.status(400).send('El mail no existe o faltan campos obligatorios');
})

router.get('/failproducts', async(req, res) => {
    res.status(400).send('Usuario no logueado o rol insuficiente para ingresar a esta venana');
})



router.post('/register', uploaderProfile.single('thumbnails'), passport.authenticate('registerAuth', {failureRedirect: '/api/sessions/failregister'}), async(req, res) => {
    try{
        res.status(200).send({ status: 'OK', data: 'Usuario registrado' })
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})

router.post('/login', passport.authenticate('loginAuth', {failureRedirect: '/api/sessions/faillogin'}), async (req, res) => {
    try{
        req.logger.warning('Se genero un logueo del usuario');
        res.status(200).send({status: 'Success', payload: 'Usuario logueado'})
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})

router.get('/logout', async(req, res) => {
    try{
        const userEmail = req.user.email
        req.session.destroy(async (err) => {
            if(err){
                res.status(500).send({ status: 'ERR', payload: err.message })
            }else{
                const user = await userModel.findOne({email: userEmail});

                const loguot = await userModel.findByIdAndUpdate(
                    user._id,
                    {$set: {last_connection: false}},
                    {new: true}
                )
                res.redirect('/login')
            }
        })
    }catch(err){
        res.status(500).send({ status: 'ERR', payload: err.message })
    }
})

router.post('/sendemail', sendConfirmation(), async(req, res) => {
    try{
        res.status(200).send({status: 'Success', payload: 'Solicitud de restablecer contraseña enviada, por favor, revise si casilla de correo electronico'});
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

router.post('/restore', async (req, res) => {
    try {
        const { token, email, pass } = req.body;
        jwt.verify(token, config.JWT_SECRET);
        const newPassword = createHash(pass);
        await userModel.findOneAndUpdate({ email }, { password: newPassword });

        req.logger.warning('Se generó un cambio de contraseña');
        res.status(200).send({status: 'success', payload: 'Contraseña actualizada'});
    } catch (err) {
        res.status(500).send({status: 'error', payload: err.message})
    }
});


router.get('/github', passport.authenticate('githubAuth', { scope: ['user:email'] }), async (req, res) => {

})

router.get('/githubcallback', passport.authenticate('githubAuth', {failureRedirect: '/login'}), async(req, res) =>{
    try{
        res.redirect('/profile');
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})

router.get('/current', handlePolicies(['ADMIN']), (req, res) => {
    try{
        if(req.user){
        const {_id, first_name, last_name, __v, password, ...user} = req.user;
        res.status(200).send({status: 'Success', payload: user})
        }else{
            res.redirect('/login')
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})


export default router