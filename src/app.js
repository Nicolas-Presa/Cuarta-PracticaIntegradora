import express from 'express'
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { __dirname } from './utils.js';
import viewsRouter from './routes/views.routes.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cookiesRouter from './routes/cookies.routes.js'
import session from 'express-session'
import sessionsRouter from './routes/sessions.routes.js'
import MongoStore from 'connect-mongo';
import passport from 'passport';



const PORT = 8080;
const MONGOOSE_URL = 'mongodb+srv://ecommerce:coder2024@cluster0.cjhgsxo.mongodb.net/ecommerce';


try{
    await mongoose.connect(MONGOOSE_URL)
    const app = express();


    app.listen(PORT, () => {
        console.log(`Servicio arctivo en puerto ${PORT}`)
    })


    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(cookieParser('Us3RS3cR3T'));
    app.use(session({ 
        store: MongoStore.create({ mongoUrl: MONGOOSE_URL, mongoOptions: {}, ttl: 60, clearInterval: 5000 }),
        secret: 'Us3RS3cR3T', 
        resave: false, 
        saveUninitialized: false 
    }))
    app.use(passport.initialize());
    app.use(passport.session());


    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/api/cookies', cookiesRouter);
    app.use('/', viewsRouter);
    app.use('/api/sessions', sessionsRouter)


    app.engine('handlebars', handlebars.engine());
    app.set('views', `${__dirname}/views`);
    app.set('view engine', 'handlebars');

    app.use('/static', express.static(`${__dirname}/public`));
}catch(err){
    console.log(`Backend: Error al inicializar, ${err.message}`)
}