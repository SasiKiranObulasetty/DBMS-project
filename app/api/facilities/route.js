// app/api/facilities/route.js
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: 1, name: "Mess", status: "active" },
            { id: 2, name: "Maintenance", status: "active" },
    { id: 3, name: "Internet", status: "active" },
    { id: 4, name: "Medical", status: "active" },
    { id: 5, name: "Entry-Exit", status: "active" },
    { id: 6, name: "Others", status: "active" },
  ]);
}
