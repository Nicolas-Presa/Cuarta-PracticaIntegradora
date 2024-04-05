import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null);

const collection = 'products';

const schema = mongoose.Schema({
    title: {type: String, required: true, index: true},
    description: {type: String, required: false},
    code: {type: String, required: true},
    price: {type: Number, required: true},
    status: {type: Boolean, default: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true, index: true},
    thumbnails: {type: String, required: false},
    owner: {type: String, default: "admin"}
})

schema.plugin(mongoosePaginate)


export default mongoose.model(collection, schema)