import { NextResponse } from "next/server";
import { testConnection, getPoolStatus } from "@/lib/db";

export async function GET() {
  try {
    const isConnected = await testConnection();
    const poolStatus = getPoolStatus();
    
    return NextResponse.json({
      status: isConnected ? "healthy" : "unhealthy",
      database: {
        connected: isConnected,
        pool: poolStatus
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json({
      status: "error",
      error: "Health check failed",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
