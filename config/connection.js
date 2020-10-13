const development = {
  database: 'rishabh_aws',    // development database
  username: 'postgres',  // username of the database
  password: 'postgres',   // password of the database
  host: 'mydb.ctmbums33jwn.ap-south-1.rds.amazonaws.com',    // hosting environment 
  dialect: 'postgres',  // database
};

const testing = {
  database: 'testing-2',  // development database
  username: 'postgres',  // username of the database
  password: '12345678',   // password of the database
  host: 'localhost',     // hosting environment 
  dialect: 'postgres', // database
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
