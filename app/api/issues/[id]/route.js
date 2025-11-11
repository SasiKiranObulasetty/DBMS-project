import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req, context) {
  try {
    // ✅ Await the params promise
    const { id } = await context.params;
    const { status } = await req.json();

    if (!id || !status) {
      console.error("Missing ID or status:", { id, status });
      return NextResponse.json({ error: "Missing ID or status" }, { status: 400 });
    }

    // ✅ Update issue status in MySQL
    const [result] = await pool.query(
      "UPDATE issue SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    console.log(`✅ Issue #${id} updated to status: ${status}`);
    return NextResponse.json({ success: true, message: "Issue updated successfully" });
  } catch (error) {
    console.error("PUT /api/issues/[id] error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
