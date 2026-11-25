import { createHash, createHmac } from "node:crypto";

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string;
};

const DEFAULT_PUBLIC_BASE_URL = "https://dl.zdtranslate.com";

export function readR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim() ?? "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim() ?? "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim() ?? "";
  const bucket = process.env.R2_BUCKET?.trim() ?? "";
  const publicBaseUrl = (
    process.env.R2_PUBLIC_BASE_URL?.trim() || DEFAULT_PUBLIC_BASE_URL
  ).replace(/\/$/, "");

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl };
}

function sha256Hex(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

function amzTimestamp(now: Date): { amzDate: string; dateStamp: string } {
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return { amzDate, dateStamp: amzDate.slice(0, 8) };
}

function encodeObjectKey(key: string): string {
  return key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function signedR2Request(
  config: R2Config,
  method: "PUT" | "DELETE",
  objectKey: string,
  body?: Buffer,
  contentType?: string,
): Promise<void> {
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${encodeObjectKey(config.bucket)}/${encodeObjectKey(objectKey)}`;
  const payload = body ?? Buffer.alloc(0);
  const payloadHash = sha256Hex(payload);
  const { amzDate, dateStamp } = amzTimestamp(new Date());
  const headers: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (contentType) {
    headers["content-type"] = contentType;
  }

  const signedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders =
    signedHeaderNames.map((name) => `${name}:${headers[name]}`).join("\n") +
    "\n";
  const signedHeaders = signedHeaderNames.join(";");
  const canonicalRequest = [
    method,
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const signingKey = hmacSha256(
    hmacSha256(
      hmacSha256(hmacSha256(`AWS4${config.secretAccessKey}`, dateStamp), "auto"),
      "s3",
    ),
    "aws4_request",
  );
  const signature = createHmac("sha256", signingKey)
    .update(stringToSign, "utf8")
    .digest("hex");
  const authorization =
    `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const requestHeaders: Record<string, string> = {
    Authorization: authorization,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (contentType) {
    requestHeaders["content-type"] = contentType;
  }

  const response = await fetch(`https://${host}${canonicalUri}`, {
    method,
    headers: requestHeaders,
    body: method === "PUT" ? new Uint8Array(payload) : undefined,
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`R2 ${method} failed (${response.status}): ${detail}`);
  }
}

export async function uploadPublicObject(
  config: R2Config,
  objectKey: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  await signedR2Request(config, "PUT", objectKey, body, contentType);
  return `${config.publicBaseUrl}/${objectKey}`;
}

export async function deletePublicObject(
  config: R2Config,
  objectKey: string,
): Promise<void> {
  await signedR2Request(config, "DELETE", objectKey);
}
