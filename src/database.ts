
import mongoose from 'mongoose'
import config  from './config'


(async () => {
    try {
        const db = await mongoose.connect(`mongodb://${config.MONGO_HOST}/${config.MONGO_DATABASE}`)
        console.log('database ',db.connection.name,' connected')
    } catch (error) {
        console.log(error)
    }
})()

