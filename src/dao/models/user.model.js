import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'users';

const schema = mongoose.Schema({
    username: {type: String, required: true, index: true},
    password: {type: String, require: true}
})

export default mongoose.model(collection, schema);