import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Get labour profile by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const labours = await query(`
      SELECT lp.*, c.name_en as category_name
      FROM labour_profiles lp
      LEFT JOIN categories c ON lp.category_id = c.id
      WHERE lp.id = ?
    `, [id]);

    if (labours.length === 0) {
      return NextResponse.json(
        { error: "Labour profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(labours[0]);
  } catch (error) {
    console.error("Labour fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch labour profile" },
      { status: 500 }
    );
  }
}

// PUT: Update labour profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Check if labour profile exists
    const existingLabour = await query("SELECT id FROM labour_profiles WHERE id = ?", [id]);
    if (existingLabour.length === 0) {
      return NextResponse.json(
        { error: "Labour profile not found" },
        { status: 404 }
      );
    }

    // Check if phone is already taken by another labour profile
    if (phone) {
      const phoneCheck = await query(
        "SELECT id FROM labour_profiles WHERE phone = ? AND id != ?",
        [phone, id]
      );
      if (phoneCheck.length > 0) {
        return NextResponse.json(
          { error: "Phone number already taken by another labour profile" },
          { status: 400 }
        );
      }
    }

    // Build update query
    let updateQuery = "UPDATE labour_profiles SET ";
    const updateValues = [];
    const updateFields = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (category_id) {
      updateFields.push("category_id = ?");
      updateValues.push(category_id);
    }
    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }
    if (rating !== undefined) {
      updateFields.push("rating = ?");
      updateValues.push(rating);
    }
    if (city) {
      updateFields.push("city = ?");
      updateValues.push(city);
    }
    if (phone) {
      updateFields.push("phone = ?");
      updateValues.push(phone);
    }
    if (email !== undefined) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }
    if (experience_years !== undefined) {
      updateFields.push("experience_years = ?");
      updateValues.push(experience_years);
    }
    if (hourly_rate !== undefined) {
      updateFields.push("hourly_rate = ?");
      updateValues.push(hourly_rate);
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP");
    updateQuery += updateFields.join(", ") + " WHERE id = ?";
    updateValues.push(id);

    await query(updateQuery, updateValues);

    const updatedLabour = await query(`
      SELECT lp.*, c.name_en as category_name
      FROM labour_profiles lp
      LEFT JOIN categories c ON lp.category_id = c.id
      WHERE lp.id = ?
    `, [id]);

    return NextResponse.json(updatedLabour[0]);
  } catch (error) {
    console.error("Labour update error:", error);
    return NextResponse.json(
      { error: "Failed to update labour profile" },
      { status: 500 }
    );
  }
}

// DELETE: Delete labour profile
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if labour profile exists
    const existingLabour = await query("SELECT id FROM labour_profiles WHERE id = ?", [id]);
    if (existingLabour.length === 0) {
      return NextResponse.json(
        { error: "Labour profile not found" },
        { status: 404 }
      );
    }

    // Check if there are any bookings associated with this labour profile
    const bookings = await query("SELECT id FROM bookings WHERE labour_id = ?", [id]);
    if (bookings.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete labour profile with existing bookings" },
        { status: 400 }
      );
    }

    // Delete labour profile
    await query("DELETE FROM labour_profiles WHERE id = ?", [id]);

    return NextResponse.json({ message: "Labour profile deleted successfully" });
  } catch (error) {
    console.error("Labour deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete labour profile" },
      { status: 500 }
    );
  }
}
