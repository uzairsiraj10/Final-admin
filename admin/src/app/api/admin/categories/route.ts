import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: List all categories
export async function GET() {
  try {
    const categories = await query(`
      SELECT id, name_en as name, name_ur as name_urdu, description_en as description, status, created_at, updated_at
      FROM categories 
      ORDER BY created_at DESC
    `);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST: Create new category
export async function POST(request: NextRequest) {
  try {
    const { name, name_urdu, description, status } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await query("SELECT id FROM categories WHERE name_en = ?", [name]);
    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    // Insert new category
    const result = await query(
      "INSERT INTO categories (name_en, name_ur, description_en, status) VALUES (?, ?, ?, ?)",
      [name, name_urdu || null, description || null, status || "active"]
    );

    const newCategory = await query("SELECT * FROM categories WHERE id = ?", [result.insertId]);

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error("Category creation error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
