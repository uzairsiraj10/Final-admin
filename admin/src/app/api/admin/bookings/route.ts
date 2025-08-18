import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: List all bookings
export async function GET() {
  try {
    const bookings = await query(`
      SELECT 
        b.*,
        u.name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        lp.name as labour_name,
        c.name as category_name
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      LEFT JOIN labour_profiles lp ON b.labour_id = lp.id
      LEFT JOIN categories c ON b.category_id = c.id
      ORDER BY b.created_at DESC
    `);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST: Create new booking
export async function POST(request: NextRequest) {
  try {
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

    // Validate required fields
    if (!customer_id || !category_id || !scheduled_date) {
      return NextResponse.json(
        { error: "Customer, category, and scheduled date are required" },
        { status: 400 }
      );
    }

    // Validate date format
    const scheduledDate = new Date(scheduled_date);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid scheduled date format" },
        { status: 400 }
      );
    }

    // Insert new booking
    const result = await query(
      `INSERT INTO bookings (
        customer_id, labour_id, category_id, status, scheduled_date, 
        amount, description, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        labour_id || null,
        category_id,
        status || "pending",
        scheduled_date,
        amount || 0,
        description || null,
        address || null
      ]
    );

    const newBooking = await query(`
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
    `, [result.insertId]);

    return NextResponse.json(newBooking[0], { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
