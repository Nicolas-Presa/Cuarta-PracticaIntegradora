import passport from "passport";
import LocalStrategy from 'passport-local';
import userModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import GithubStrategy from 'passport-github2';


const initPassport = () => {
    const verifyRegistration = async (req, username, password, done) => {
        try{
            const user = await userModel.findOne({email: username})

            if(user){
                return done('Ya hay un usuario registrado con este mail', false)
            }

            const newUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: username,
                age: req.body.age,
                password: createHash(password)
            }
            const process = await userModel.create(newUser)
            return done(null, process)
        }catch(err){
            return done('error passport local', err.message)
        }
    }

    passport.use('registerAuth', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        passwordField: 'pass'
    }, verifyRegistration))


    const verifyRestoration = async(req, username, password, done) => {
        try{
            const user = await userModel.findOne({ email: username })

            if (!user) return done('No existe un usuario registrado con este mail', false)

            const newPassword = await userModel.findOneAndUpdate({email: username}, {password: createHash(password)})

            return done(null, newPassword);
        }catch(err){
            return done('error passport local', err.message);
        }
    }

    passport.use('restoreAuth', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        passwordField: 'pass'
    }, verifyRestoration))


    const verifyLogin = async(req, username, password, done) =>{
        const user = await userModel.findOne({email: username})

        if(!user){
            return done('Usuario o contraseña incorrecta', false)
        }

        if(user !== null && isValidPassword(user, password)){
            return done(null, user)
        }else{
            return done('error en passport local', false)
        }
    }

    passport.use('loginAuth', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        passwordField: 'pass'
    }, verifyLogin))


    const verifyGithub = async(accessToken, refreshToken, profile, done) => {
        try{
            const user = await userModel.findOne({email: profile._json.email})
            if(!user){
                const newUser = {
                    username: `${profile._json.login}@gmail.com`,
                    password: ' '
                }

                const process = await userModel.create(newUser);
                return done(null, process)
            }else{
                return done(null, user)
            }
        }catch(err){
            return done('error de passport github', err.message)
        }
    }

    passport.use('githubAuth', new GithubStrategy({
        clientID: 'Iv1.8d450c33842d72eb',
        clientSecret: 'ffaa53b457786c783f05daafb9f95e79d95bd073',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, verifyGithub))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })


    passport.deserializeUser(async (id, done) => {
        try {
            done(null, await userModel.findById(id).lean())
        } catch (err) {
            done(err.message)
        }
    })
}

export default initPassport