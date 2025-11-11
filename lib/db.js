import mysql from "mysql2/promise";

let pool; 

if (!pool) {
 pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: process.env.DB_CA.replace(/\\n/g, "\n"),
    rejectUnauthorized: false,
  },
  connectTimeout: 20000, // 20 seconds
});


  console.log("✅ MySQL connection pool created (SSL enabled)");
}

export default pool;
