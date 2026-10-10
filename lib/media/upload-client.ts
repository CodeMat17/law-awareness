"use client";

import { createUploadTicket } from "./upload-actions";
import { MAX_UPLOAD_BYTES, formatBytes, type AssetKind } from "./cloudinary";

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; message: string; aborted?: boolean };

interface UploadOptions {
  /** Called once signing is done, with 0-100 as the bytes move. */
  onProgress?: (percent: number) => void;
  /** Hands over the request so the caller can offer a Cancel button. */
  onRequest?: (request: XMLHttpRequest) => void;
}

/**
 * Sends one file from this browser straight to Cloudinary and resolves with
 * its delivery URL.
 *
 * Shared by the upload field and the article editor, so a photo dropped into
 * a story is held to exactly the same rules as a lead image: the server signs
 * only for a signed-in editor, only for the right kind of file, and only under
 * the size cap.
 */
export async function uploadAsset(
  file: File,
  kind: AssetKind,
  { onProgress, onRequest }: UploadOptions = {}
): Promise<UploadResult> {
  // Answered here before anything is sent, so an editor who picked the wrong
  // file learns that instantly rather than after pushing 400MB up a hotel
  // connection. The limit that binds is the server's - it refuses to sign -
  // but being told late is its own kind of broken.
  if (file.size > MAX_UPLOAD_BYTES[kind]) {
    return {
      ok: false,
      message: `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(
        MAX_UPLOAD_BYTES[kind]
      )} — compress it and try again.`,
    };
  }

  const result = await createUploadTicket(kind, {
    bytes: file.size,
    mimeType: file.type,
  });
  if (!result.ok) return { ok: false, message: result.message };

  const { ticket } = result;
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", ticket.apiKey);
  body.append("timestamp", String(ticket.timestamp));
  body.append("signature", ticket.signature);
  body.append("folder", ticket.folder);
  // Signed by the server, so Cloudinary honours it. Resizes the image on the
  // way in rather than storing the original.
  if (ticket.transformation) {
    body.append("transformation", ticket.transformation);
  }

  return new Promise<UploadResult>((resolve) => {
    // XHR rather than fetch: upload progress is the one thing fetch still
    // cannot report, and progress is the point of the callers.
    const request = new XMLHttpRequest();
    onRequest?.(request);
    request.open("POST", ticket.endpoint);

    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      onProgress?.(Math.round((event.loaded / event.total) * 100));
    });

    request.addEventListener("load", () => {
      if (request.status < 200 || request.status >= 300) {
        resolve({ ok: false, message: "Cloudinary rejected the upload. Try again." });
        return;
      }
      try {
        const payload = JSON.parse(request.responseText) as { secure_url?: string };
        if (!payload.secure_url) throw new Error("no url");
        resolve({ ok: true, url: payload.secure_url });
      } catch {
        resolve({ ok: false, message: "Cloudinary returned something unexpected." });
      }
    });

    request.addEventListener("error", () =>
      resolve({ ok: false, message: "The upload failed. Try again." })
    );
    request.addEventListener("abort", () =>
      resolve({ ok: false, message: "Upload cancelled.", aborted: true })
    );

    onProgress?.(0);
    request.send(body);
  });
}
