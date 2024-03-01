import express from 'express'
import handlebars from 'express-handlebars'
import session from 'express-session'
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cors from 'cors';

import { __dirname } from './utils.js';
import config from './config.js'
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js'
import sessionsRouter from './routes/sessions.routes.js'
import MongoSingleton from './services/mongo.singleton.js';



const PORT = config.PORT;


try{
    MongoSingleton.getInstance()
    const app = express();


    app.listen(PORT, () => {
        console.log(`Servicio arctivo en puerto ${PORT}`)
    })

    app.use(cors({
        origin: '*',
        methods: 'GET,POST,PUT,PATCH,DELETE'
    }));

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(session({ 
        store: MongoStore.create({ mongoUrl: config.MONGOOSE_URL, mongoOptions: {}, ttl: 60, clearInterval: 5000 }),
        secret: 'Us3RS3cR3T', 
        resave: false, 
        saveUninitialized: false 
    }))
    app.use(passport.initialize());
    app.use(passport.session());


    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/api/sessions', sessionsRouter);
    app.use('/', viewsRouter);


    app.engine('handlebars', handlebars.engine());
    app.set('views', `${__dirname}/views`);
    app.set('view engine', 'handlebars');

    app.use('/static', express.static(`${__dirname}/public`));


    app.all('*', (req, res, next)=>{
        res.status(404).send({ status: 'ERR', data: 'Página no encontrada' });
    })
    
}catch(err){
    console.log(`Backend: Error al inicializar, ${err.message}`)
}