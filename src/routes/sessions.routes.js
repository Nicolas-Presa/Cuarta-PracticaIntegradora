import { Router } from "express";
import initPassport from '../auth/passport.auth.js';
import passport from "passport";



initPassport();
const router = Router();

const handlePolicies = policies => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ status: 'ERR', data: 'Usuario no autorizado' });

        const userRole = req.user.role.toUpperCase();
        const normalizedPolicies = policies.map(policy => policy.toUpperCase());

        if (normalizedPolicies.includes(userRole)) {
            return next();
        } else {
            return res.status(403).send({ status: 'ERR', data: 'Sin permisos suficientes' });
        }
    }
};


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

router.post('/register', passport.authenticate('registerAuth', {failureRedirect: '/api/session/failregister'}), async(req, res) => {
    try{
        res.status(200).send({ status: 'OK', data: 'Usuario registrado' })
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})

router.post('/login', passport.authenticate('loginAuth', {failureRedirect: '/api/sessions/faillogin'}), async (req, res) => {
    try{
        res.status(200).send({status: 'Success', payload: 'Usuario logueado'})
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})

router.get('/logout', (req, res) => {
    try{
        req.session.destroy((err) => {
            if(err){
                res.status(500).send({ status: 'ERR', payload: err.message })
            }else{
                res.redirect('/login')
            }
        })
    }catch(err){
        res.status(500).send({ status: 'ERR', payload: err.message })
    }
})

router.post('/restore', passport.authenticate('restoreAuth', {failureRedirect: '/api/session/failrestore'}), async(req, res) => {
    try{
        res.status(200).send({status: 'success', payload: 'Contraseña actualizada'})
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})


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
            res.status(200).send({status: 'Success', payload: req.user})
        }else{
            res.redirect('/login')
        }
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message})
    }
})


export default router