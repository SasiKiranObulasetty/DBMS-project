import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { identifier, password } = await req.json();
    console.log("DEBUG login request:", identifier, password);

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Email/Username and password are required" },
        { status: 400 }
      );
    }

    // 🧩 Check if admin exists
    const [adminRows] = await pool.query(
      `SELECT * FROM admin WHERE email = ? OR name = ?`,
      [identifier, identifier]
    );

    if (adminRows.length > 0) {
      const admin = adminRows[0];

      if (admin.password === password) {
        console.log("✅ Admin authenticated:", admin.email);

        // 🧠 Facility mapping based on facility_id
        const facilityMap = {
          1: "mess",
          2: "maintenance",
          3: "entry-exit",
          4: "internet",
          5: "medical",
        };

        const facility_category = facilityMap[admin.facility_id] || null;

        return NextResponse.json({
          success: true,
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role || "facilityadmin",
            facility_id: admin.facility_id || null,
            facility_category, // ✅ Now included
          },
        });
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid password" },
          { status: 401 }
        );
      }
    }

    // 🧩 Check if student exists
    const [studentRows] = await pool.query(
      "SELECT * FROM student WHERE email = ? OR name = ?",
      [identifier, identifier]
    );

    if (studentRows.length > 0) {
      const student = studentRows[0];

      if (student.password === password) {
        console.log("✅ Student authenticated:", student.email);
        return NextResponse.json({
          success: true,
          user: {
            id: student.id,
            name: student.name,
            email: student.email,
            room_number: student.room_number,
            role: "student",
          },
        });
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid password" },
          { status: 401 }
        );
      }
    }

    // ❌ If no user found
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );

  } catch (err) {
    console.error("❌ Error in /api/login:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
