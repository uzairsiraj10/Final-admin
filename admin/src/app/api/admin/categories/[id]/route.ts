import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Get category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const categories = await query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    if (categories.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(categories[0]);
  } catch (error) {
    console.error("Category fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT: Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, name_urdu, description, status } = await request.json();

    // Check if category exists
    const existingCategory = await query("SELECT id FROM categories WHERE id = ?", [id]);
    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if name is already taken by another category
    if (name) {
      const nameCheck = await query(
        "SELECT id FROM categories WHERE name_en = ? AND id != ?",
        [name, id]
      );
      if (nameCheck.length > 0) {
        return NextResponse.json(
          { error: "Category name already taken by another category" },
          { status: 400 }
        );
      }
    }

    // Build update query
    let updateQuery = "UPDATE categories SET ";
    const updateValues = [];
    const updateFields = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (name_urdu !== undefined) {
      updateFields.push("name_urdu = ?");
      updateValues.push(name_urdu);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }
    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP");
    updateQuery += updateFields.join(", ") + " WHERE id = ?";
    updateValues.push(id);

    await query(updateQuery, updateValues);

    const updatedCategory = await query("SELECT * FROM categories WHERE id = ?", [id]);

    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE: Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if category exists
    const existingCategory = await query("SELECT id FROM categories WHERE id = ?", [id]);
    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if there are any labour profiles or bookings using this category
    const labourProfiles = await query("SELECT id FROM labour_profiles WHERE category_id = ?", [id]);
    const bookings = await query("SELECT id FROM bookings WHERE category_id = ?", [id]);
    
    if (labourProfiles.length > 0 || bookings.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category that is being used by labour profiles or bookings" },
        { status: 400 }
      );
    }

    // Delete category
    await query("DELETE FROM categories WHERE id = ?", [id]);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Category deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
