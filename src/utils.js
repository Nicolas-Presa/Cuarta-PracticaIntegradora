import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import config from './config.js'
import jwt from 'jsonwebtoken'


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)


const mailerService = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GOOGLE_APP_EMAIL,
        pass: config.GOOGLE_APP_PASS
    }
});


export const sendConfirmation = () => {
    return async (req, res, next) => {
        try{
            const userEmail = req.body.email;
            const user = { email: userEmail };
            const secret = config.JWT_SECRET;
            const token = jwt.sign(user, secret, { expiresIn: '1h' });
            const resetLink = `http://localhost:8080/restore/${token}`;


            const subject = 'CoderStore Restablecer contraseña';
            const html = `
                <a href="${resetLink}">Click aquí para restablecer tu contraseña</a>
                <p> Este link funcionara durante 1 hora, pasada la hora debera solicitar un nuevo link nuevamente <p>
            `;

            await mailerService.sendMail({
                from: config.GOOGLE_APP_EMAIL,
                to: req.body.email,
                subject: subject,
                html: html
            });
            
            next()
        }catch(err){
            res.status(500).send({status: 'error', payload: err.message})
        }
    }
}
