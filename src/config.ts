import dotenv from 'dotenv'
dotenv.config()

export default {
    MONGO_DATABASE: 'test2',
    MONGO_USER: 'admin',
    MONGO_PASSWORD: 'admin',
    MONGO_HOST: '127.0.0.1:27017',
    SERVER_PORT: process.env.PORT || 3000
}