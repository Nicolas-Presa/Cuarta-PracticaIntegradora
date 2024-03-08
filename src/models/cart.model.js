import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'carts';

const schema = mongoose.Schema({
    products: [{
        _id: false,
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
        quantity: {type: Number, required: true}
    }],
    total: {type: Number, required: false} 
})

schema.pre('find', function() {
    this.populate('products.productId');
})



export default mongoose.model(collection, schema)