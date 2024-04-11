import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session'
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cors from 'cors';


import { __DIRNAME } from './utils.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import messagesRouter from './routes/messages.routes.js'
import MongoSingleton from './services/mongo.singleton.js';
import errorsDictionary from './services/error.dictionary.js';
import addLogger from './services/winston.logger.js';
import loggerRouter from './routes/logger.routes.js';
import usersRouter from './routes/users.routes.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';



const PORT = process.env.PORT || 3000;


try{
    MongoSingleton.getInstance()
    const app = express();

    const swaggerOptions = {
        definition: {
            openapi: '3.0.1',
            info: {
                title: 'Documentacion de ecommerce',
                description: 'Esta documentacion cubre todas la API habilitada para el ecommerce'
            },
        },
        apis: ['./src/docs/**/*.yaml'],
    };
    
    const specs = swaggerJsdoc(swaggerOptions)


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
        store: MongoStore.create({ mongoUrl: process.env.MONGOOSE_URL, mongoOptions: {}, ttl: 1800, clearInterval: 5000 }),
        secret: 'Us3RS3cR3T', 
        resave: false, 
        saveUninitialized: false 
    }))
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(addLogger);

    app.use('/api/logger', loggerRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/api/sessions', sessionsRouter);
    app.use('/api/messages', messagesRouter);
    app.use('/api/users', usersRouter);
    app.use('/', viewsRouter);
    app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


    app.engine('handlebars', handlebars.engine({helpers: {eq: (v1, v2) => v1 === v2,}}));
    app.set('views', `${__DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    app.use('/static', express.static(`${__DIRNAME}/public`));

    app.use((err, req, res, next) => {
        const code = err.code || 500;
        res.status(code).send({status: 'error', payload: err.message})
    }); 

    app.all('*', (req, res, next)=>{
        res.status(404).send({ status: 'error', payload: errorsDictionary.PAGE_NOT_FOUND.message });
    })
    
}catch(err){
    console.log(`Backend: Error al inicializar, ${err.message}`)
}