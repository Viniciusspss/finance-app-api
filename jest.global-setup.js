import { execSync } from 'child_process'
import { connectDatabase } from './src/database/mongoose.js'

async function init() {
    if (!process.env.CI) {
        execSync('docker compose up -d --wait mongodb-test')
    }

    await connectDatabase()
}

export default init
