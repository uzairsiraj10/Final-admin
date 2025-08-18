import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const [
      flights,
      hotels,
      cars,
      tours,
      properties,
      bookings,
      payments,
    ] = await Promise.all([
      query("SELECT COUNT(*) as count FROM flights"),
      query("SELECT COUNT(*) as count FROM hotels"),
      query("SELECT COUNT(*) as count FROM cars"),
      query("SELECT COUNT(*) as count FROM tours"),
      query("SELECT COUNT(*) as count FROM properties"),
      query("SELECT COUNT(*) as count FROM bookings"),
      query("SELECT COUNT(*) as count FROM payments"),
    ]);

    return NextResponse.json({
      flights: flights[0]?.count || 0,
      hotels: hotels[0]?.count || 0,
      cars: cars[0]?.count || 0,
      tours: tours[0]?.count || 0,
      properties: properties[0]?.count || 0,
      bookings: bookings[0]?.count || 0,
      payments: payments[0]?.count || 0,
    });
  } catch (error) {
    console.error("[STATS]", error);
    return new NextResponse("Database error", { status: 500 });
  }
} 