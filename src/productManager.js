import fs from 'fs'




class ProductManager{
    constructor(path){
        this.path = path;
        this.product = []
        this.idProduct = 0;
    }

    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error reading file:', error.message);
        }
    }

    async saveProducts() {
        const productJson = JSON.stringify(this.products, null, 2);
        try {
            await fs.promises.writeFile(this.path, productJson);
        } catch (error) {
            console.error('Error writing to file:', error.message);
        }
    }




    async addProduct(product) {
        await this.loadProducts();

        const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        const newProductId = maxId + 1;

        product.id = newProductId;
        product.status = true;

        this.products.push(product);

        this.saveProducts();
    }

    getProducts = async(limit) => {
        let products = [];
        const product = await fs.promises.readFile(this.path, {encoding:'utf-8'})
        const productParse = JSON.parse(product)
        
        if (limit) {
            products = productParse.slice(0, limit);
        } else {
            products = productParse;
        }
        return products;
    }

    getProductById = async (id) => {
        const product = await fs.promises.readFile(this.path, {encoding:'utf-8'})
        const productParse = JSON.parse(product)

        const productById = productParse.find(product => product.id === id)
        if(productById){
            return productById;
        }else{
            return null;
        }
    }
    
    async updateProduct(id, newData) {
        await this.loadProducts();

        const productToUpdate = this.products.find(product => product.id === id);

        if (productToUpdate) {
            Object.assign(productToUpdate, newData);
            await this.saveProducts();
            console.log(`Product with ID ${id} updated successfully.`);
        } else {
            console.log(`Product with ID ${id} not found.`);
        }
    }

    deleteProduct = async (id) => {
        await this.loadProducts();

        const idProduct = this.products.findIndex(product => product.id === id)

        if(idProduct !== -1){
            this.products.splice(idProduct, 1);
            await this.saveProducts();
        }else{
            console.error("ERROR, Product Not Found");
        }
    }
}




// await manager1.deleteProduct(0)


export {ProductManager};