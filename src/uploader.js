import multer from 'multer'
import config from './config.js'

const storageProducts = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${config.__DIRNAME}/public/img`)
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const storageProfile = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, `${config.__DIRNAME}/public/profile`)
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const storageDocument = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${config.__DIRNAME}/public/documents`)
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const uploaderProducts = multer({ storage: storageProducts });
export const uploaderProfile = multer({ storage: storageProfile });
export const uploaderDocument = multer({ storage: storageDocument });