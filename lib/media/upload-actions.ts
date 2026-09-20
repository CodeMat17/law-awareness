"use server";

import { createHash } from "node:crypto";
import { requireRole } from "@/lib/cms/auth";
import {
  MAX_STORED_IMAGE_EDGE,
  MAX_UPLOAD_BYTES,
  UPLOAD_FOLDER,
  formatBytes,
  isCloudinaryUrl,
  publicIdFromUrl,
  resourceTypeFor,
  type AssetKind,
} from "./cloudinary";

/**
 * Signed direct uploads.
 *
 * The browser sends the file to Cloudinary itself; this server only signs the
 * request. The alternative - posting the file to a Server Action and relaying
 * it - would put a 500MB documentary through the Next.js server, past a body
 * size limit, and give the editor no progress bar. Here the bytes take one hop
 * and the upload reports its own progress.
 *
 * An unsigned upload preset would remove this file entirely, and with it the
 * only thing standing between the internet and our media library: an unsigned
 * preset can be used by anyone who reads the cloud name out of an image URL.
 * So uploads are signed, and a signature is issued only to a signed-in editor.
 */

export interface UploadTicket {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  /** Signed incoming transformation, applied before Cloudinary stores the file. */
  transformation?: string;
  resourceType: "image" | "video";
  /** The cap this ticket was issued against, so the UI can name it. */
  maxBytes: number;
  /** Where the browser POSTs the file. */
  endpoint: string;
}

export type UploadTicketResult =
  | { ok: true; ticket: UploadTicket }
  | { ok: false; message: string };

function config() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

/**
 * Cloudinary's signature: the signed parameters, sorted by name, joined as a
 * query string, with the API secret appended, hashed with SHA-1. Only the
 * parameters included here are signed - and only signed parameters are
 * trusted, which is why `folder` is signed and the file itself is not.
 */
function sign(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

/**
 * Issues a one-shot ticket for a single upload.
 *
 * The timestamp is part of the signature, and Cloudinary refuses one much
 * older than an hour, so a ticket that leaks is not a standing upload
 * permission.
 *
 * The size limit is enforced here rather than in the browser. A check in the
 * component is a courtesy - it gives the editor an instant answer instead of a
 * failed upload - but the limit that actually holds is this one: without a
 * signature there is no upload, so an oversized file never reaches the
 * account, and no quota is spent finding that out.
 */
export async function createUploadTicket(
  kind: AssetKind,
  file: { bytes: number; mimeType: string }
): Promise<UploadTicketResult> {
  try {
    await requireRole("author");
  } catch {
    return { ok: false, message: "You are not allowed to upload media." };
  }

  const env = config();
  if (!env) {
    return {
      ok: false,
      message:
        "Cloudinary is not configured. Add the cloud name, API key and secret to .env.local.",
    };
  }

  const limit = MAX_UPLOAD_BYTES[kind];
  if (file.bytes > limit) {
    return {
      ok: false,
      message: `That file is ${formatBytes(file.bytes)}. The limit is ${formatBytes(limit)} — compress it and try again.`,
    };
  }

  const expected = kind === "image" ? /^image\// : /^(video|audio)\//;
  if (!expected.test(file.mimeType)) {
    return {
      ok: false,
      message:
        kind === "image"
          ? "That is not an image file."
          : "That is not a video or audio file.",
    };
  }

  const resourceType = resourceTypeFor(kind);
  const folder = `${UPLOAD_FOLDER}/${resourceType === "image" ? "images" : "media"}`;
  const timestamp = Math.round(Date.now() / 1000);

  /**
   * An incoming transformation: Cloudinary applies it before storing, so what
   * occupies the account is the web-sized image and not the phone original.
   * `c_limit` only ever shrinks, so an image already smaller than the cap is
   * passed through untouched rather than being upscaled into a bigger file.
   *
   * Video gets none of this. An incoming transformation on video means a
   * transcode, which is billed and slow, and the delivery-side `q_auto` in
   * cloudinary.ts already does the work that matters for bandwidth.
   */
  const transformation =
    kind === "image"
      ? `c_limit,w_${MAX_STORED_IMAGE_EDGE},h_${MAX_STORED_IMAGE_EDGE},q_auto`
      : undefined;

  const signed: Record<string, string | number> = { folder, timestamp };
  if (transformation) signed.transformation = transformation;
  const signature = sign(signed, env.apiSecret);

  return {
    ok: true,
    ticket: {
      cloudName: env.cloudName,
      apiKey: env.apiKey,
      timestamp,
      signature,
      folder,
      transformation,
      resourceType,
      maxBytes: limit,
      endpoint: `https://api.cloudinary.com/v1_1/${env.cloudName}/${resourceType}/upload`,
    },
  };
}

/**
 * Deletes an asset, given the delivery URL a field held.
 *
 * Called when an editor replaces or clears an upload. Failure is reported but
 * never blocks the edit: an orphaned file in Cloudinary is a housekeeping
 * problem, while a field the editor cannot clear is a broken CMS.
 */
export async function deleteAsset(
  url: string,
  kind: AssetKind
): Promise<{ ok: boolean; message?: string }> {
  try {
    await requireRole("author");
  } catch {
    return { ok: false, message: "You are not allowed to delete media." };
  }

  const env = config();
  if (!env) return { ok: false, message: "Cloudinary is not configured." };
  if (!isCloudinaryUrl(url)) return { ok: true };

  const publicId = publicIdFromUrl(url);
  if (!publicId) return { ok: true };

  const timestamp = Math.round(Date.now() / 1000);
  const signature = sign({ public_id: publicId, timestamp }, env.apiSecret);
  const resourceType = resourceTypeFor(kind);

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    signature,
    api_key: env.apiKey,
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.cloudName}/${resourceType}/destroy`,
    { method: "POST", body }
  );

  if (!response.ok) return { ok: false, message: "Cloudinary refused the delete." };
  return { ok: true };
}
