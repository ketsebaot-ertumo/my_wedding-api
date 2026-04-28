const { parse } = require("pg-connection-string");
require("dotenv").config();

const dbUrl = parse(process.env.DATABASE_URL);
console.log(process.env.DATABASE_URL);

const commonConfig = {
  username: dbUrl.user,
  password: dbUrl.password,
  database: dbUrl.database,
  host: dbUrl.host,
  port: dbUrl.port,
  dialect: "postgres",
  logging: false,
  dialectModule: require("pg"),
};

module.exports = {
  development: {
    ...commonConfig,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
  test: {
    ...commonConfig,
  },
  production: {
    ...commonConfig,
  },
};
