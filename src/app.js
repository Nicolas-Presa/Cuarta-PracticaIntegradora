import express from 'express'
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
//Importaciones necesarias para trabajar

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const PORT = 8080;


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);





app.listen(PORT, () => {
    console.log("Servidor activo en el puerto 8080");
})