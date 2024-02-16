import { Router } from "express";

const router = Router();

const auth = (req, res, next) => {
    try{
        if(req.session.user){
            const { user, pass } = req.body
            if(req.session.user.username === user && req.session.user.password === pass){
                next();
            }else{
                res.status(400).send('usuario o clave incorrecto');
            }
        }else{
            res.status(500).send('Usuario no registrado');
        }
    }catch(err){
        res.status(500).send({status: 'err', payload: err.message});
    }
}

router.post('/register', (req, res) => {
    try{
        const { email, pass } = req.body;

        if(email === 'adminCoder@coder.com' && pass === 'adminCod3r123'){
            req.session.user = { username: email, password: pass, admin: true };
        }else{
            req.session.user = {username: email, password: pass, user: true};
        }
        res.redirect('/products/login');
    }catch(err){
        res.status(500).send({status: 'error', payload: err.message});
    }
})

router.post('/login', auth, (req, res) => {
    try{
        res.redirect('/products')
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
                res.redirect('/products/login')
            }
        })
    }catch(err){
        res.status(500).send({ status: 'ERR', payload: err.message })
    }
})


export default router