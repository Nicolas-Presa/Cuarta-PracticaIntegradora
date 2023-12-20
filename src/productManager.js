import fs from 'fs'




class ProductManager{
    constructor(path){
        this.path = path;
        this.product = []
        this.idProduct = 0;
    }

    addProduct = async(product) => {
        this.idProduct = this.idProduct + 1;
        product.id = this.idProduct;

        this.product.push(product);
        const productJson = JSON.stringify(this.product, null, 2);
        await fs.promises.writeFile(this.path, productJson);
}

    getProducts = async() => {
        let products = [];
        const product = await fs.promises.readFile(this.path, {encoding:'utf-8'})
        const productParse = JSON.parse(product)
        products = productParse;
        
        return products
    }

    getProductById = async (id) => {
        const product = await fs.promises.readFile(this.path, {encoding:'utf-8'})
        const productParse = JSON.parse(product)

        const productById = productParse.find(product => product.id === id)
        if(productById){
            console.log(productById);
        }else{
            console.error("ERROR, Product Not found");
        }
    }
    
    updateProduct = async (id, newData) => {
        const product = await fs.promises.readFile(this.path, {encoding:'utf-8'})
        const productParse = JSON.parse(product)

        const productById = await productParse.findIndex(product => product.id === id)
        if(productById){
            productParse[id] = newData
            const productStrinify = JSON.stringify(productParse, null, 2);
            await fs.promises.writeFile(this.path, productStrinify);
        }else{
            console.error("ERROR, Product Not Found");
        }
    }

    deleteProduct = async (id) => {
        const product = await fs.promises.readFile(this.path, {encoding:'utf-8'})
        const productParse = JSON.parse(product)

        const productById = await productParse.findIndex(product => product.id === id)
        if(productById){
            productParse.splice(id, 1);
            const productStrinify = JSON.stringify(productParse, null, 2);
            await fs.promises.writeFile(this.path, productStrinify);
        }else{
            console.error("ERROR, Product Not Found");
        }
    }
}





// await manager1.getProducts();
// await manager1.getProductById(2);


// await manager1.updateProduct(0, 
// {
//     title: "Manzana",
//     description: "Esta Manzana es roja",
//     price: 1500,
//     thumbnail: './',
//     stock: 100,
//     code: 250}
// )


// await manager1.deleteProduct(0)


export {ProductManager};