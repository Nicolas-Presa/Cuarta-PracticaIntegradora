import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'users';

const schema = mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    full_name: {type: String, required: false},
    email: {type: String, required: true, index: true},
    age: {type: Number, required: false},
    password: {type: String, required: true},
    cartId: {type: mongoose.Schema.Types.ObjectId, ref: 'cart', required: false},
    role: {type: String, enum: ['user', 'premium', 'admin'], default: 'user'}
})

export default mongoose.model(collection, schema);