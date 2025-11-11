import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, roomNumber } = await req.json();
    console.log("DEBUG register request:", name, email, roomNumber);

    if (!name || !email || !password || !roomNumber) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Check if already exists in admin or student
    const [existingAdmin] = await pool.query(
      "SELECT * FROM admin WHERE email = ? OR name = ?",
      [email, name]
    );
    const [existingStudent] = await pool.query(
      "SELECT * FROM student WHERE email = ? OR name = ?",
      [email, name]
    );

    if (existingAdmin.length > 0 || existingStudent.length > 0) {
      return NextResponse.json(
        { success: false, message: "User with this email or name already exists" },
        { status: 409 }
      );
    }

    // 2️⃣ Insert new student
    await pool.query(
      "INSERT INTO student (name, email, password, room_number) VALUES (?, ?, ?, ?)",
      [name, email, password, roomNumber]
    );

    console.log("✅ Student registered:", email);

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: { name, email, roomNumber, role: "student" },
    });
  } catch (err) {
    console.error("❌ Error in /api/register:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
