import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function getClientUserId(
  request: Request,
): Promise<{ userId: string } | NextResponse> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return unauthorized("Missing or invalid Authorization header");
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return unauthorized("Missing access token");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.json(
      { error: "Auth is not configured" },
      { status: 500 },
    );
  }

  const supabase = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return unauthorized("Invalid or expired access token");
  }

  return { userId: user.id };
}
