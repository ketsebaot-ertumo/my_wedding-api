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
  port: dbUrl.port,
  dialect: "postgres",
  logging: false,
  dialectModule: require("pg"),
};

// SSL configuration for Neon
const sslConfig = {
  ssl: {
    require: true,
    rejectUnauthorized: false, 
  },
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