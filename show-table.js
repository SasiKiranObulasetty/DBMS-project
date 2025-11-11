import { db } from "./lib/db.js";

async function showTables() {
  try {
    const [rows] = await db.query("SHOW TABLES FROM hostel_management");
    console.log("✅ Tables in your database:");
    console.table(rows);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    process.exit(0);
  }
}

showTables();
