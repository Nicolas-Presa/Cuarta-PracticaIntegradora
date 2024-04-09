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

export const sendUsersDeleteConfirmation = async (users) => {
    try {
        const promises = users.map(user => {
            const userEmail = user.email;
            const subject = 'Notificación de CoderStore: Cuenta eliminada';
            const html = `
                <h1>Cuenta Eliminada</h1>
                <p>Tu cuenta ha sido eliminada por inactividad. Si deseas volver a utilizar nuestros servicios, por favor crea una nueva cuenta.</p>
            `;

            return mailerService.sendMail({
                from: config.GOOGLE_APP_EMAIL,
                to: userEmail,
                subject: subject,
                html: html
            });
        });

        await Promise.all(promises);
    } catch (err) {
        console.error('Error sending deletion confirmation emails:', err.message);
    }
}