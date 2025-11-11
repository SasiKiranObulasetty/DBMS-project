import { db } from "./lib/db.js";

async function testConnection() {
  try {
    // ✅ Use correct MySQL syntax — no alias confusion
    const [rows] = await db.query("SELECT NOW() AS time_now");
    console.log("✅ MySQL connected successfully!");
    console.log("Current time from DB:", rows[0].time_now);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  } finally {
    process.exit(0);
  }
}

testConnection();
