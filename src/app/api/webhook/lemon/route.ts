import { handleLemonWebhook } from "@/utils/api/lemon-webhook-handler";

/** @deprecated Prefer `/api/webhooks/lemonsqueezy` — kept for existing Lemon dashboard URLs. */
export async function POST(request: Request) {
  return handleLemonWebhook(request);
}
