import 'dotenv/config'

import { connectDatabase } from './src/database/mongoose.js'
import { app } from './src/app.js'

await connectDatabase()

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})
