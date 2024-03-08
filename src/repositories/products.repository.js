class ProductDTO {
    constructor(product) {
        this.product = product;
        this.product.title = this.product.title.toUpperCase();
    }

    getProduct() {
        return this.product
    }
}


export { ProductDTO }