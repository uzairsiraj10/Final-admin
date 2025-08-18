import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Fetch recent activity from multiple sources
    const activity = await query(`
      (SELECT 
        'user' as type,
        CONCAT('New user registered: ', name) as description,
        created_at as timestamp
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 3)
      UNION ALL
      (SELECT 
        'labour' as type,
        CONCAT('New labour profile: ', name) as description,
        created_at as timestamp
      FROM labour_profiles 
      ORDER BY created_at DESC 
      LIMIT 3)
      UNION ALL
      (SELECT 
        'booking' as type,
        CONCAT('New booking created - Amount: $', amount) as description,
        created_at as timestamp
      FROM bookings 
      ORDER BY created_at DESC 
      LIMIT 3)
      UNION ALL
      (SELECT 
        'referral' as type,
        CONCAT('New referral: ', referred_name) as description,
        created_at as timestamp
      FROM referrals 
      ORDER BY created_at DESC 
      LIMIT 3)
      ORDER BY timestamp DESC 
      LIMIT 10
    `);

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Dashboard activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}