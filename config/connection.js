const development = {
  database: 'demo',
  username: 'postgres',
  password: 'postgres',
  host: 'mydb.ctmbums33jwn.ap-south-1.rds.amazonaws.com',
  dialect: 'postgres',
};

const testing = {
  database: 'testing-2',
  username: 'postgres',
  password: 'postgres',
  host: 'localhost',
  dialect: 'postgres',
};

const production = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST || 'localhost',
  dialect: 'sqlite' || 'mysql' || 'postgres',
};

module.exports = {
  development,
  testing,
  production,
};
