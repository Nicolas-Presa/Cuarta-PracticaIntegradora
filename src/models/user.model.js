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
    thumbnails: {type: String, required: false},
    cartId: {type: mongoose.Schema.Types.ObjectId, ref: 'cart', required: false},
    role: {type: String, enum: ['user', 'premium', 'admin'], default: 'user'},
    documents: [{
        _id: false,
        name: {type: String, required: false},
        reference: {type: String, required: false}
    }],
    last_connection: {type: Boolean, default: false},
    last_connection_date: {type: Date, required: false}
})

export default mongoose.model(collection, schema);