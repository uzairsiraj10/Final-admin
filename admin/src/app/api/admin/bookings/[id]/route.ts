import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Get booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const bookings = await query(`
      SELECT 
        b.*,
        u.name as customer_name,
        u.email as customer_email,
        lp.name as labour_name,
        c.name as category_name
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      LEFT JOIN labour_profiles lp ON b.labour_id = lp.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `, [id]);

    if (bookings.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bookings[0]);
  } catch (error) {
    console.error("Booking fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT: Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { 
      customer_id,
      labour_id,
      category_id,
      status,
      scheduled_date,
      amount,
      description,
      address
    } = await request.json();

    // Check if booking exists
    const existingBooking = await query("SELECT id FROM bookings WHERE id = ?", [id]);
    if (existingBooking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Build update query
    let updateQuery = "UPDATE bookings SET ";
    const updateValues = [];
    const updateFields = [];

    if (customer_id) {
      updateFields.push("customer_id = ?");
      updateValues.push(customer_id);
    }
    if (labour_id !== undefined) {
      updateFields.push("labour_id = ?");
      updateValues.push(labour_id);
    }
    if (category_id) {
      updateFields.push("category_id = ?");
      updateValues.push(category_id);
    }
    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }
    if (scheduled_date) {
      // Validate date format
      const scheduledDate = new Date(scheduled_date);
      if (isNaN(scheduledDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid scheduled date format" },
          { status: 400 }
        );
      }
      updateFields.push("scheduled_date = ?");
      updateValues.push(scheduled_date);
    }
    if (amount !== undefined) {
      updateFields.push("amount = ?");
      updateValues.push(amount);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }
    if (address !== undefined) {
      updateFields.push("address = ?");
      updateValues.push(address);
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP");
    updateQuery += updateFields.join(", ") + " WHERE id = ?";
    updateValues.push(id);

    await query(updateQuery, updateValues);

    const updatedBooking = await query(`
      SELECT 
        b.*,
        u.name as customer_name,
        u.email as customer_email,
        lp.name as labour_name,
        c.name as category_name
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      LEFT JOIN labour_profiles lp ON b.labour_id = lp.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `, [id]);

    return NextResponse.json(updatedBooking[0]);
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE: Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if booking exists
    const existingBooking = await query("SELECT id FROM bookings WHERE id = ?", [id]);
    if (existingBooking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Delete booking
    await query("DELETE FROM bookings WHERE id = ?", [id]);

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Booking deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
