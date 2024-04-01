import * as url from 'url'
import { Command } from 'commander';
import dotenv from 'dotenv';

dotenv.config();


const commandLineOptions = new Command();


commandLineOptions
.option('--mode <mode>')
.option('--port <port>')
commandLineOptions.parse()


switch (commandLineOptions.opts().mode) {
    case 'prod':
        dotenv.config({ path: './.prod.env'});
        break;
    
    case 'devel':
    default:
        dotenv.config({ path: './.devel.env'});
}


const config = {
    PORT: commandLineOptions.opts().port || process.env.PORT || 3000,
    MODE: commandLineOptions.opts().mode || 'devel',
    __FILNAME: url.fileURLToPath(import.meta.url),
    __DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    MONGOOSE_URL: process.env.MONGOOSE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GITHUB_AUTH: {
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret,
        callbackUrl: process.env.callbackUrl
    },
    GOOGLE_APP_EMAIL: process.env.GOOGLE_APP_EMAIL,
    GOOGLE_APP_PASS: process.env.GOOGLE_APP_PASS,
    JWT_SECRET: process.env.JWT_SECRET
}


export default config