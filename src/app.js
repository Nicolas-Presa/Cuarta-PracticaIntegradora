import express from 'express'
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { __dirname } from './utils.js';
import viewsRouter from './routes/views.routes.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
//Importaciones necesarias para trabajar

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servicio arctivo en puerto ${PORT}`)
})
const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', data => {
        console.log(data);
    })

    socket.on('addProduct', (newProduct) => {
        socketServer.emit('productAdded', newProduct);
    });
})





app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/products', viewsRouter);


app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/static', express.static(`${__dirname}/public`));