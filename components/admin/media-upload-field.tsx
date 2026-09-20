"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, Loader2, Trash2, Upload } from "lucide-react";
import { cn } from "cn";
import { createUploadTicket, deleteAsset } from "@/lib/media/upload-actions";
import {
  MAX_UPLOAD_BYTES,
  formatBytes,
  imageUrl,
  type AssetKind,
} from "@/lib/media/cloudinary";

interface MediaUploadFieldProps {
  /** Form field name; the hidden input under it carries the stored URL. */
  name: string;
  kind: AssetKind;
  defaultValue: string;
  describedBy?: string;
  id: string;
}

/** What the picker offers. */
const ACCEPT: Record<AssetKind, string> = {
  image: "image/*",
  video: "video/*,audio/*",
};

type Phase =
  | { state: "idle" }
  | { state: "signing" }
  | { state: "uploading"; percent: number }
  | { state: "error"; message: string };

/**
 * An upload field for a photo, video or audio file.
 *
 * The file goes straight from this browser to Cloudinary; what ends up in the
 * form - and therefore in Convex - is only the delivery URL. The editor sees
 * the whole of that journey: signing, a real percentage while the bytes move,
 * then the asset itself. A long upload with no feedback reads as a broken
 * form, and an editor who reloads mid-upload loses the file.
 */
export function MediaUploadField({
  name,
  kind,
  defaultValue,
  describedBy,
  id,
}: MediaUploadFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [phase, setPhase] = useState<Phase>({ state: "idle" });
  const [removing, startRemoving] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<XMLHttpRequest | null>(null);

  const busy = phase.state === "signing" || phase.state === "uploading";

  const upload = useCallback(
    async (file: File) => {
      // Answered here before anything is sent, so an editor who picked the
      // wrong file learns that instantly rather than after pushing 400MB up a
      // hotel connection. The limit that binds is the server's - it refuses to
      // sign - but being told late is its own kind of broken.
      if (file.size > MAX_UPLOAD_BYTES[kind]) {
        setPhase({
          state: "error",
          message: `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(
            MAX_UPLOAD_BYTES[kind]
          )} — compress it and try again.`,
        });
        return;
      }

      setPhase({ state: "signing" });

      const result = await createUploadTicket(kind, {
        bytes: file.size,
        mimeType: file.type,
      });
      if (!result.ok) {
        setPhase({ state: "error", message: result.message });
        return;
      }

      const { ticket } = result;
      const body = new FormData();
      body.append("file", file);
      body.append("api_key", ticket.apiKey);
      body.append("timestamp", String(ticket.timestamp));
      body.append("signature", ticket.signature);
      body.append("folder", ticket.folder);
      // Signed by the server, so Cloudinary honours it. Resizes the image on
      // the way in rather than storing the original.
      if (ticket.transformation) {
        body.append("transformation", ticket.transformation);
      }

      // XHR rather than fetch: upload progress is the one thing fetch still
      // cannot report, and progress is the point of this component.
      const request = new XMLHttpRequest();
      requestRef.current = request;
      request.open("POST", ticket.endpoint);

      request.upload.addEventListener("progress", (event) => {
        if (!event.lengthComputable) return;
        setPhase({
          state: "uploading",
          percent: Math.round((event.loaded / event.total) * 100),
        });
      });

      request.addEventListener("load", () => {
        requestRef.current = null;
        if (request.status < 200 || request.status >= 300) {
          setPhase({
            state: "error",
            message: "Cloudinary rejected the upload. Try again.",
          });
          return;
        }
        try {
          const payload = JSON.parse(request.responseText) as {
            secure_url?: string;
          };
          if (!payload.secure_url) throw new Error("no url");
          setValue(payload.secure_url);
          setPhase({ state: "idle" });
        } catch {
          setPhase({
            state: "error",
            message: "Cloudinary returned something unexpected.",
          });
        }
      });

      request.addEventListener("error", () => {
        requestRef.current = null;
        setPhase({ state: "error", message: "The upload failed. Try again." });
      });

      request.addEventListener("abort", () => {
        requestRef.current = null;
        setPhase({ state: "idle" });
      });

      setPhase({ state: "uploading", percent: 0 });
      request.send(body);
    },
    [kind]
  );

  const remove = useCallback(() => {
    const current = value;
    setValue("");
    setPhase({ state: "idle" });
    // The field clears immediately and the file is deleted behind it. An
    // editor waiting on Cloudinary to empty a form field would be waiting for
    // no reason - the record is what they are editing, not the file.
    startRemoving(async () => {
      await deleteAsset(current, kind);
    });
  }, [value, kind]);

  return (
    <div>
      {/* The only thing the form submits. */}
      <input type="hidden" name={name} value={value} />

      <AnimatePresence mode="wait" initial={false}>
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden rounded-xl border border-hairline bg-background"
          >
            {kind === "image" ? (
              // Not next/image: this is an editor preview of a file uploaded
              // seconds ago, and Cloudinary is already serving it at the right
              // size and format.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl(value, { width: 640 })}
                alt=""
                className="max-h-56 w-full bg-muted object-contain"
              />
            ) : (
              <video
                src={value}
                controls
                preload="metadata"
                className="max-h-56 w-full bg-black"
              />
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-3.5 py-2.5">
              <p className="min-w-0 flex-1 truncate text-[0.76rem] text-muted-foreground">
                {value.split("/").pop()}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={busy}
                  className="inline-flex h-8 items-center rounded-lg border border-hairline px-3 text-[0.76rem] font-bold text-foreground transition-colors hover:border-primary/60 disabled:opacity-50"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={remove}
                  disabled={busy || removing}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[0.76rem] font-bold text-destructive transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {removing ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="picker"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            aria-describedby={describedBy}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-background px-4 py-7 text-[0.85rem] font-semibold text-muted-foreground transition-colors",
              !busy && "hover:border-primary/60 hover:text-foreground",
              busy && "cursor-progress"
            )}
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {phase.state === "signing"
              ? "Preparing upload…"
              : phase.state === "uploading"
                ? `Uploading… ${phase.percent}%`
                : kind === "image"
                  ? "Choose a photo"
                  : "Choose a video or audio file"}
            {!busy && (
              <span className="font-normal text-muted-foreground/70">
                up to {formatBytes(MAX_UPLOAD_BYTES[kind])}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* The bar stays visible over a preview while a replace is in flight. */}
      <AnimatePresence>
        {phase.state === "uploading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={phase.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Upload progress"
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${phase.percent}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {phase.state === "uploading" && (
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-[0.76rem] text-muted-foreground" role="status">
            Uploading to Cloudinary… {phase.percent}%
          </p>
          <button
            type="button"
            onClick={() => requestRef.current?.abort()}
            className="text-[0.76rem] font-bold text-muted-foreground underline-offset-4 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      {phase.state === "error" && (
        <p
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-[0.76rem] font-semibold text-destructive"
        >
          <CircleAlert className="size-3.5 shrink-0" />
          {phase.message}
        </p>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT[kind]}
        // Deliberately not `required`: the input is visually hidden, and a
        // hidden invalid control makes the browser refuse to submit while
        // having nothing to focus, so the editor gets a dead Save button and
        // no message. `saveRecord` enforces required fields and can say so.
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Reset so choosing the same file twice after an error still fires.
          event.target.value = "";
          if (file) void upload(file);
        }}
      />
    </div>
  );
}
