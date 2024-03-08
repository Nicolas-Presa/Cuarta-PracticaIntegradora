import mongoose from 'mongoose'

mongoose.pluralize(null);

const collection = 'message';

const schema = mongoose.Schema({
    email: {type: String, required: true},
    message: {type: String, required: true}
})


export default mongoose.model(collection, schema)