import { handleLemonWebhook } from "@/utils/api/lemon-webhook-handler";

export async function POST(request: Request) {
  return handleLemonWebhook(request);
}
