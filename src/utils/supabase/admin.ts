import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function readJwtRole(key: string): string | null {
  const part = key.split(".")[1];
  if (!part) return null;
  try {
    const padded = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as {
      role?: unknown;
    };
    return typeof json.role === "string" ? json.role : null;
  } catch {
    return null;
  }
}

export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin client is not configured");
  }

  const role = readJwtRole(serviceRoleKey);
  if (role && role !== "service_role") {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY has role "${role}" instead of "service_role"; billing writes would be blocked by RLS`,
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  });
}
