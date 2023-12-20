import { ProductManager } from "./productManager.js";
import express from 'express'
//Importaciones necesarias para trabajar

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const PORT = 8080;
//Activo express y creo una constante del puerto con el que voy a trabajar

const manager1 = new ProductManager('./products.json');

const newProduct = {
    title: "Manzana",
    description: "Esta Manzana es verde",
    price: 150,
    thumbnail: './',
    stock: 20,
    code: 250
}

const newProduct2 = {
    title: "zanahoria",
    description: "Esta zanahoria es naranja",
    price: 100,
    thumbnail: './',
    stock: 50,
    code: 251
}

const newProduct3 = {
    title: "Kiwi",
    description: "Este Kiwi es violeta",
    price: 250,
    thumbnail: './',
    stock: 60,
    code: 252
}
//Creo un Manager y almaceno 3 productos que le van a corresponder en formato de objeto
await manager1.addProduct(newProduct);
await manager1.addProduct(newProduct2);
await manager1.addProduct(newProduct3);
const products = await manager1.getProducts();
// Y luego los agrego 


app.get('/products', async (req, res) => {
    res.send( {products} ) //Envio al endpoint products un array de todos los products del manager1
    
})

app.get('products/:pid', async(req, res) => {
    let productPid = req.params.pid;
    let product = products.find(p => p.id === productPid)

    if(!product){
        return res.send( {error: 'Producto no encontrado'} );
    }else{
        return res.send( {product} );
    }  //CODIGO NO FUNCIONA, no pude encontrar el error, la logica parece correcta pero algo no debo estar escribiendo bien y no puedo encontrar que
})


app.listen(PORT, () => {
    console.log("Servidor activo en el puerto 8080");
})