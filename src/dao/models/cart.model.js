import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'carts';

const schema = mongoose.Schema({
    products: [{
        productId: {type: String, require: true},
        quantity: {type: Number, require: true}
    }]
})


export default mongoose.model(collection, schema)