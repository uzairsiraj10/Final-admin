import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: List all labour profiles
export async function GET() {
  try {
    const labours = await query(`
      SELECT lp.*, c.name as category_name
      FROM labour_profiles lp
      LEFT JOIN categories c ON lp.category_id = c.id
      ORDER BY lp.created_at DESC
    `);
    return NextResponse.json(labours);
  } catch (error) {
    console.error("Labour fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch labour profiles" },
      { status: 500 }
    );
  }
}

// POST: Create new labour profile
export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      category_id, 
      status, 
      rating, 
      city, 
      phone, 
      email,
      description,
      experience_years,
      hourly_rate 
    } = await request.json();

    // Validate required fields
    if (!name || !category_id || !city || !phone) {
      return NextResponse.json(
        { error: "Name, category, city, and phone are required" },
        { status: 400 }
      );
    }

    // Check if labour with this phone already exists
    const existingLabour = await query("SELECT id FROM labour_profiles WHERE phone = ?", [phone]);
    if (existingLabour.length > 0) {
      return NextResponse.json(
        { error: "Labour profile with this phone number already exists" },
        { status: 400 }
      );
    }

    // Insert new labour profile
    const result = await query(
      `INSERT INTO labour_profiles (
        name, category_id, status, rating, city, phone, email, 
        description, experience_years, hourly_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        category_id, 
        status || "pending", 
        rating || 0, 
        city, 
        phone, 
        email || null,
        description || null,
        experience_years || 0,
        hourly_rate || 0
      ]
    );

    const newLabour = await query(`
      SELECT lp.*, c.name as category_name
      FROM labour_profiles lp
      LEFT JOIN categories c ON lp.category_id = c.id
      WHERE lp.id = ?
    `, [result.insertId]);

    return NextResponse.json(newLabour[0], { status: 201 });
  } catch (error) {
    console.error("Labour creation error:", error);
    return NextResponse.json(
      { error: "Failed to create labour profile" },
      { status: 500 }
    );
  }
}
