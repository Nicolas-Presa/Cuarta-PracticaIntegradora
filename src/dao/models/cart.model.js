import mongoose from 'mongoose';
import productModel from '../models/product.model.js'

mongoose.pluralize(null);

const collection = 'carts';

const schema = mongoose.Schema({
    products: [{
        _id: false,
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
        quantity: {type: Number, require: true}
    }]
})

schema.pre('find', function() {
    this.populate('products.productId');
})



export default mongoose.model(collection, schema)