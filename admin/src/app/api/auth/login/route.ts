import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const result = await login(email, password);
    
    // Redirect to dashboard after successful login
    return NextResponse.json(
      { success: true, user: result.user },
      { 
        status: 200,
        headers: {
          'Set-Cookie': `token=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }
} 