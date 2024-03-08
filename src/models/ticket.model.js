import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'ticket'

const schema = mongoose.Schema({
    code: {type: String, default: () => `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`, unique: true},
    purchaser_datetime: {type: Date, default: Date.now},
    amount: {type: Number, default: 0},
    purchaser: {type: [mongoose.Schema.Types.ObjectId], ref: 'user' }
})

schema.pre('find', function() {
    this.populate('user.email');
})

export default mongoose.model(collection, schema)