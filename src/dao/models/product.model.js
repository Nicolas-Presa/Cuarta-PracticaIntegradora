import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'products';

const schema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
    code: {type: String, required: true},
    price: {type: String, default: true},
    status: {type: String, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    thumbnails: {type: String, required: false}
})


export default mongoose.model(collection, schema)