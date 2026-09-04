import { execSync } from 'child_process'

async function init() {
    if (!process.env.CI) {
        execSync('docker compose up -d --wait mongodb-test')
    }
}

export default init
