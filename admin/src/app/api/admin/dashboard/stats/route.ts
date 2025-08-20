import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Fetch real stats from database
    const [
      usersResult,
      labourResult,
      bookingsResult,
      revenueResult,
      referralsResult
    ] = await Promise.all([
      query("SELECT COUNT(*) as count FROM users WHERE role != 'admin'"),
      query("SELECT COUNT(*) as count FROM labour_profiles"),
      query("SELECT COUNT(*) as count FROM bookings"),
      query("SELECT COALESCE(SUM(amount), 0) as total FROM bookings WHERE payment_status = 'paid'"),
      query("SELECT COUNT(*) as count FROM referrals"),
    ]);

    // Calculate growth percentages (comparing with previous month)
    const [
      prevUsersResult,
      prevLabourResult,
      prevBookingsResult,
      prevRevenueResult
    ] = await Promise.all([
      query("SELECT COUNT(*) as count FROM users WHERE role != 'admin' AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)"),
      query("SELECT COUNT(*) as count FROM labour_profiles WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)"),
      query("SELECT COUNT(*) as count FROM bookings WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)"),
      query("SELECT COALESCE(SUM(amount), 0) as total FROM bookings WHERE payment_status = 'paid' AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)"),
    ]);

    const currentUsers = parseInt(usersResult[0]?.count || 0);
    const currentLabour = parseInt(labourResult[0]?.count || 0);
    const currentBookings = parseInt(bookingsResult[0]?.count || 0);
    const currentRevenue = parseFloat(revenueResult[0]?.total || 0);

    const prevUsers = parseInt(prevUsersResult[0]?.count || 0);
    const prevLabour = parseInt(prevLabourResult[0]?.count || 0);
    const prevBookings = parseInt(prevBookingsResult[0]?.count || 0);
    const prevRevenue = parseFloat(prevRevenueResult[0]?.total || 0);

    const stats = {
      totalUsers: currentUsers,
      totalLabour: currentLabour,
      totalBookings: currentBookings,
      totalRevenue: currentRevenue,
      totalReferrals: parseInt(referralsResult[0]?.count || 0),
      userGrowth: prevUsers > 0 ? ((currentUsers - prevUsers) / prevUsers) * 100 : 0,
      labourGrowth: prevLabour > 0 ? ((currentLabour - prevLabour) / prevLabour) * 100 : 0,
      bookingGrowth: prevBookings > 0 ? ((currentBookings - prevBookings) / prevBookings) * 100 : 0,
      revenueGrowth: prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

