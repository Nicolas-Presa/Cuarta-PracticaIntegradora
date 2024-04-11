import mongoose from 'mongoose';


export default class MongoSingleton {
    static #instance;

    constructor() {
        mongoose.connect(process.env.MONGOOSE_URL);
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new MongoSingleton();
            console.log('Conexión bbdd CREADA');
        } else {
            console.log('Conexión bbdd RECUPERADA');
        }

        return this.#instance;
    }
}