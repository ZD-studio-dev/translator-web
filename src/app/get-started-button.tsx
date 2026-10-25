"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type GetStartedButtonProps = {
  className?: string;
  children?: ReactNode;
};

export function GetStartedButton({
  className,
  children = "Get Started",
}: GetStartedButtonProps) {
  const router = useRouter();

  async function handleGetStarted() {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }

  return (
    <button type="button" onClick={handleGetStarted} className={className}>
      {children}
    </button>
  );
}
