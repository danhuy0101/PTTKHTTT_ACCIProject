require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: 'TTNNDB',
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

module.exports = config;
