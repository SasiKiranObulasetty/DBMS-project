import { NextResponse } from "next/server";
import pool from "@/lib/db"; // ✅ import your MySQL connection

// 🟢 Create a new issue
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("🧾 Incoming issue data:", body);

    const { student_id, title, description, category } = body;

    if (!student_id || !title || !description || !category) {
      console.error("❌ Missing field:", { student_id, title, description, category });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedCategory = category.toLowerCase().replace(" ", "_");

    await pool.query(
      "INSERT INTO issue (student_id, title, description, category, status) VALUES (?, ?, ?, ?, 'pending')",
      [student_id, title, description, normalizedCategory]
    );

    console.log("✅ Issue inserted successfully!");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/issues error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟣 Fetch issues (with optional filters)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id");
    const facilityId = searchParams.get("facility_id"); // 🆕 For facility admins

    let query = `
      SELECT i.*, s.name AS student_name, s.room_number
      FROM issue i
      JOIN student s ON i.student_id = s.id
    `;
    const values = [];

    // 🧩 Filter 1: Facility Admin (based on facility_id)
    if (facilityId) {
      const [facilityRows] = await pool.query(
        "SELECT category FROM facility WHERE id = ?",
        [facilityId]
      );
      const facilityCategory = facilityRows[0]?.category;

      if (facilityCategory) {
        query += " WHERE i.category = ? ORDER BY i.created_at DESC";
        values.push(facilityCategory);
      } else {
        console.warn("⚠️ No category found for facility_id:", facilityId);
      }
    }
    // 🧩 Filter 2: Student
    else if (studentId) {
      query += " WHERE i.student_id = ? ORDER BY i.created_at DESC";
      values.push(studentId);
    }
    // 🧩 Default: Super Admin — view all
    else {
      query += " ORDER BY i.created_at DESC";
    }

    const [rows] = await pool.query(query, values);
    return NextResponse.json({ success: true, issues: rows });
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json({ success: false, error: "Database fetch failed" }, { status: 500 });
  }
}
