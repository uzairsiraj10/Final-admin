import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[AUTH_ROUTE] Incoming login request body:', body);
    try {
      console.log('[AUTH_ROUTE] Request headers:', Object.fromEntries(request.headers.entries()))
    } catch (e) {
      console.log('[AUTH_ROUTE] Could not read headers for logging');
    }

    const { email, password } = body || {};
    console.log('[AUTH_ROUTE] Calling login() for email:', email);
    const result = await login(email, password);
    console.log('[AUTH_ROUTE] login() succeeded for email:', email);
    
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
  } catch (err) {
    const error = err as unknown;
    let errMsg: string;
    if (typeof error === 'object' && error !== null) {
  errMsg = (error as any).stack || (error as any).message || JSON.stringify(error);
    } else {
      errMsg = String(error);
    }
    console.error('[AUTH_ROUTE] login error:', errMsg);
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }
} 