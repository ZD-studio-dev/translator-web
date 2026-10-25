"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function SignOutButton() {
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-900"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      Sign Out
    </button>
  );
}
