const { parse } = require("pg-connection-string");
require("dotenv").config();

const dbUrl = parse(process.env.DATABASE_URL);
// console.log(process.env.DATABASE_URL);

const commonConfig = {
  username: dbUrl.user,
  password: dbUrl.password,
  database: dbUrl.database,
  // database: `${dbUrl.database}?options=endpoint%3Dep-withered-violet-a4khy6ii`, 
  host: dbUrl.host,
  port: dbUrl.port ? parseInt(dbUrl.port, 10) : 5432,
  dialect: "postgres",
  logging: false,
  dialectModule: require("pg"),
  debug: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  retry: {
    max: 0,
  },
};

// SSL configuration for Neon
const sslConfig = {
  ssl: {
    require: true,
    rejectUnauthorized: false, 
  },
  // Keep the connection alive
  keepAlive: true,
  // Connection timeout
  connectTimeout: 60000,
};

module.exports = {
  development: {
    ...commonConfig,
    dialectOptions: sslConfig,
  },
  test: {
    ...commonConfig,
    dialectOptions: sslConfig,
  },
  production: {
    ...commonConfig,
    dialectOptions: sslConfig, 
  },
};