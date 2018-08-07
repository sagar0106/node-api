module.exports = {
    appPort: 3011,

    mongoDb: {
        host: 'localhost',
        port: 27017,
        dbname: 'perfectBi',
        username: '',
        password: ''
    },
    dbconnection: 'mongodb://localhost:27017/testDb',
    sessionSecret: 'developmentSessionSecret',
    secret: 'ilivelifefreely',
    frontUrl: 'http://localhost:4000/#',
    key: 'ILikeTheSecret',
    tokenExpires: '24h', // in hour
    secure: {
        algorithm: 'aes-256-ctr',
        password: 'ILikeTheSecret'
    }
}