import { Command } from 'commander';
import dotenv from 'dotenv';

dotenv.config();


const commandLineOptions = new Command();


commandLineOptions
.option('--mode <mode>')
.option('--port <port>')
commandLineOptions.parse()



const config = {
    PORT: commandLineOptions.opts().port || process.env.PORT || 5000,
    MONGOOSE_URL: process.env.MONGOOSE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GITHUB_AUTH: {
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret,
        callbackUrl: process.env.callbackUrl
    }
}


export default config