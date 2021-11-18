const { promisify } = require('util');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// const host = process.env.REDIS_HOST;



const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_SERVER_IP);
// const client = redis.createClient(6380, "localhost");

module.exports.Set = promisify(client.set).bind(client);
module.exports.Get = promisify(client.get).bind(client);
module.exports.Ex = promisify(client.setex).bind(client);
module.exports.Flush = promisify(client.flushall).bind(client);
