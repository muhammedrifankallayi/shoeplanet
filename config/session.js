const dotenv = require('dotenv')


const SessionSecret=process.env.SessionSecret;
const adminsecret = process.env.adminsecret;

module.exports={
    SessionSecret,
    adminsecret
}
