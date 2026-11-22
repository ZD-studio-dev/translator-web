"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type GetStartedButtonProps = {
  className?: string;
  children?: ReactNode;
  downloadUrl?: string | null;
};

export function GetStartedButton({
  className,
  children = "Get Started",
  downloadUrl = null,
}: GetStartedButtonProps) {
  const router = useRouter();
  const url = downloadUrl?.trim() || null;

  if (url) {
    return (
      <a href={url} download rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  async function handleGetStarted() {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      router.push("/dashboard");
      return;
    }
    router.push("/login?notice=download&next=/dashboard");
  }

  return (
    <button type="button" onClick={handleGetStarted} className={className}>
      {children}
    </button>
  );
}
