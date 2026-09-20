/**
 * Cloudinary delivery — the read half of media storage.
 *
 * Photos and videos are not held in Convex. Convex stores the delivery URL a
 * Cloudinary upload returned and nothing else, so the database stays small and
 * cheap to read, and the bytes are served from a CDN that already does format
 * negotiation, resizing and video transcoding better than we would.
 *
 * Nothing in this module touches the API secret, so it is safe in a client
 * bundle. Signing lives in lib/media/upload-actions.ts, which is server-only.
 */

export const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

/** What an upload field accepts and where it lands in the media library. */
export type AssetKind = "image" | "video";

/**
 * Cloudinary's own word for the same thing. Audio is uploaded as `video`:
 * Cloudinary has no separate audio resource type, and podcast files go through
 * the video pipeline exactly as an MP4 does.
 */
export function resourceTypeFor(kind: AssetKind): "image" | "video" {
  return kind === "image" ? "image" : "video";
}

/** Every folder the CMS is allowed to upload into, by field kind. */
export const UPLOAD_FOLDER = "law-aware";

/* -------------------------------------------------------------------------- */
/* Quota discipline                                                            */
/* -------------------------------------------------------------------------- */

/**
 * A Cloudinary plan is a pool of credits, and storage, delivered bandwidth and
 * transformation count all draw on the same pool. Nothing here is free, so
 * three things are held down deliberately:
 *
 * 1. What gets stored. Images are resized *before* Cloudinary stores them (see
 *    the incoming transformation in upload-actions.ts), so a 12-megapixel
 *    phone photo becomes a web-sized file and the original never occupies
 *    storage at all.
 * 2. What gets delivered. `f_auto,q_auto` is on every delivery URL, which is
 *    typically a 40-70% saving over serving the stored file as-is.
 * 3. How many distinct derivatives exist. Every unique transformation string
 *    is a separate derived asset that is generated once and stored. Widths are
 *    snapped to the ladder below rather than taken from a layout, so the site
 *    has a handful of derivatives per image instead of one per breakpoint
 *    anybody ever wrote down.
 *
 * Bandwidth is usually the first limit a media site meets, and video is what
 * spends it. That is why the player uses `preload="metadata"` and a poster
 * image: an episode page costs a few kilobytes until a reader presses play.
 */

/**
 * The largest file the CMS will accept, by kind.
 *
 * Enforced by refusing to sign the upload, so it is a real limit and not a
 * suggestion the browser makes. Deliberately generous for video and tight for
 * images: an image over 10MB is a mistake, while a documentary legitimately is
 * not.
 */
export const MAX_UPLOAD_BYTES: Record<AssetKind, number> = {
  image: 10 * 1024 * 1024,
  video: 300 * 1024 * 1024,
};

/**
 * The longest edge an uploaded photo is stored at. Nothing on the site renders
 * an image wider than the content column on a large display, and storing a
 * 6000px original to serve an 800px one is paying for bytes twice - once in
 * storage, once every time a derivative is generated from them.
 */
export const MAX_STORED_IMAGE_EDGE = 2400;

/**
 * The only widths the site asks Cloudinary for. Every request snaps up to one
 * of these, so the number of derived assets stays bounded no matter how many
 * layouts get built on top.
 */
export const IMAGE_WIDTHS = [320, 640, 960, 1280, 1920] as const;

/** The smallest ladder width that still covers the requested size. */
function snapWidth(width: number): number {
  return IMAGE_WIDTHS.find((step) => step >= width) ?? IMAGE_WIDTHS.at(-1)!;
}

/** Human-readable size, for the message an editor gets when a file is refused. */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)}GB`;
  }
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}

const DELIVERY_HOST = "res.cloudinary.com";

/**
 * Whether a stored value is a delivery URL from *our* cloud.
 *
 * Field values arrive as strings from a form, so an editor - or anything
 * posting to the action - could put any URL in an image field. Rejecting
 * anything but our own cloud keeps a CMS field from becoming a way to embed
 * third-party content on the site.
 */
export function isCloudinaryUrl(value: string): boolean {
  if (!CLOUD_NAME) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === DELIVERY_HOST &&
      url.pathname.startsWith(`/${CLOUD_NAME}/`)
    );
  } catch {
    return false;
  }
}

/**
 * The public id inside a delivery URL, which is what the delete API takes.
 *
 * Derived rather than stored: a second field holding the id could drift from
 * the URL beside it, and the URL is the one of the two the site actually
 * renders. Returns null for anything that is not one of our URLs.
 */
export function publicIdFromUrl(value: string): string | null {
  if (!isCloudinaryUrl(value)) return null;
  const path = new URL(value).pathname.split("/").slice(2); // drop "", cloud name
  const uploadAt = path.indexOf("upload");
  if (uploadAt === -1) return null;

  let rest = path.slice(uploadAt + 1);
  // A version segment ("v1712345678") is not part of the id.
  if (/^v\d+$/.test(rest[0] ?? "")) rest = rest.slice(1);
  if (rest.length === 0) return null;

  const joined = rest.join("/");
  // The extension is not part of the id either, but a dot inside a folder name
  // is - so only strip a trailing one from the last segment.
  return joined.replace(/\.[a-z0-9]+$/i, "");
}

/**
 * Inserts a transformation into a delivery URL.
 *
 * Cloudinary transformations are a path segment right after `/upload`, so this
 * is a string edit rather than a round trip. Anything that is not one of our
 * URLs is returned untouched: the caller may be rendering seeded content that
 * still points under /public.
 */
export function transform(url: string, transformation: string): string {
  if (!isCloudinaryUrl(url) || transformation.length === 0) return url;
  return url.replace("/upload/", `/upload/${transformation}/`);
}

/**
 * A still image sized for a layout slot, in whatever format the browser takes.
 *
 * `f_auto,q_auto` is the whole reason media moved here: one stored URL serves
 * AVIF to a browser that wants it and JPEG to one that does not, without the
 * Next image optimizer re-fetching and re-encoding the file on our servers.
 */
export function imageUrl(
  url: string,
  { width, height }: { width?: number; height?: number } = {}
): string {
  const parts = ["f_auto", "q_auto"];
  // Snapped to the ladder: a width taken straight from a layout would mint a
  // new derived asset for every distinct number the site ever asks for.
  if (width) parts.push(`w_${snapWidth(width)}`);
  if (height) parts.push("c_fill", `h_${height}`);
  return transform(url, parts.join(","));
}

/**
 * A poster frame for a video that has no poster image of its own. Cloudinary
 * renders it from the video itself, so a newly uploaded episode is never a
 * black rectangle while an editor finds artwork for it.
 */
export function posterFromVideo(url: string, width = 1280): string {
  if (!isCloudinaryUrl(url)) return url;
  return transform(url, `f_jpg,q_auto,w_${width},so_0`).replace(
    /\.[a-z0-9]+$/i,
    ".jpg"
  );
}

/** Adaptive-ish playback: automatic codec and quality for the viewer's device. */
export function videoUrl(url: string): string {
  return transform(url, "f_auto,q_auto");
}

/** MIME type for a stored URL, for the `<source type>` the player needs. */
export function mimeTypeFor(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase() ?? "";
  const audio: Record<string, string> = {
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    aac: "audio/aac",
    wav: "audio/wav",
    ogg: "audio/ogg",
  };
  const video: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    m3u8: "application/x-mpegURL",
  };
  return audio[extension] ?? video[extension] ?? "video/mp4";
}
